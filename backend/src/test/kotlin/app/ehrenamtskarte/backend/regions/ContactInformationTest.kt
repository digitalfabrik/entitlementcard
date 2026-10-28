package app.ehrenamtskarte.backend.regions

import app.ehrenamtskarte.backend.IntegrationTest
import app.ehrenamtskarte.backend.db.repositories.RegionsRepository
import app.ehrenamtskarte.backend.generated.GetContactInformationMailPreview
import app.ehrenamtskarte.backend.generated.UpdateContactInformation
import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.toDataObject
import app.ehrenamtskarte.backend.helper.toErrorObject
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNull
import kotlin.test.assertTrue

internal class ContactInformationTest : IntegrationTest() {
    private val contactInformation = "Ehrenamtsbüro Augsburg\nTel.: 0821 123 456-0"

    @AfterEach
    fun cleanUp() {
        transaction {
            RegionsRepository.findRegionById(16).apply {
                this.contactInformation = null
                contactInformationActivated = false
            }
        }
    }

    @Test
    fun `should return an unauthorized error when updating while not logged in`() {
        val response = postGraphQL(createMutation(16))

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(GraphQLExceptionCode.UNAUTHORIZED, response.toErrorObject().extensions.code)
    }

    @Test
    fun `should return a forbidden error when updating with an unauthorized role`() {
        val response = postGraphQL(createMutation(16), TestAdministrators.EAK_REGION_MANAGER.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(GraphQLExceptionCode.FORBIDDEN, response.toErrorObject().extensions.code)
    }

    @Test
    fun `should return an error when updating with too long contact information`() {
        val response = postGraphQL(
            createMutation(16, "a".repeat(501), true),
            TestAdministrators.EAK_REGION_ADMIN.getJwtToken(),
        )

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(GraphQLExceptionCode.INVALID_CONTACT_INFORMATION_SIZE, response.toErrorObject().extensions.code)
    }

    @Test
    fun `should update the contact information`() {
        val response = postGraphQL(
            createMutation(16, contactInformation, true),
            TestAdministrators.EAK_REGION_ADMIN.getJwtToken(),
        )

        assertEquals(HttpStatus.OK, response.statusCode)
        assertTrue(response.toDataObject<Boolean>())
        transaction {
            assertEquals(contactInformation, RegionsRepository.findRegionById(16).activeContactInformation)
        }
    }

    @Test
    fun `should not return deactivated contact information for mails`() {
        postGraphQL(createMutation(16, contactInformation, false), TestAdministrators.EAK_REGION_ADMIN.getJwtToken())

        transaction {
            assertNull(RegionsRepository.findRegionById(16).activeContactInformation)
        }
    }

    @Test
    fun `should return a forbidden error when requesting the preview for a different region`() {
        val response = postGraphQL(createPreviewQuery(94), TestAdministrators.EAK_REGION_ADMIN.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(GraphQLExceptionCode.FORBIDDEN, response.toErrorObject().extensions.code)
    }

    @Test
    fun `should return the application confirmation mail html filled with example data`() {
        val response = postGraphQL(createPreviewQuery(16), TestAdministrators.EAK_REGION_ADMIN.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val html = response.toDataObject<String>()

        assertTrue(html.contains("<p>Sehr geehrte/r Erika Musterfrau,</p>"))
        assertTrue(html.contains("Ihr Team der Ehrenamtskarte Bayern"))
    }

    @Test
    fun `should include the contact information in the preview only if it is activated and not blank`() {
        val token = TestAdministrators.EAK_REGION_ADMIN.getJwtToken()

        val htmlWithContact = postGraphQL(createPreviewQuery(16, contactInformation, true), token)
            .toDataObject<String>()
        val htmlWithDeactivatedContact = postGraphQL(createPreviewQuery(16, contactInformation, false), token)
            .toDataObject<String>()
        val htmlWithBlankContact = postGraphQL(createPreviewQuery(16, " ", true), token).toDataObject<String>()

        assertTrue(
            htmlWithContact.contains(
                Regex("<blockquote>\\s*<p>Ehrenamtsbüro Augsburg<br>Tel.: 0821 123 456-0</p>\\s*</blockquote>"),
            ),
        )
        assertFalse(htmlWithDeactivatedContact.contains("Ehrenamtsbüro Augsburg"))
        assertFalse(htmlWithBlankContact.contains("zuständige Stelle"))
    }

    private fun createMutation(
        regionId: Int,
        contactInformation: String = "",
        contactInformationActivated: Boolean = false,
    ): UpdateContactInformation =
        UpdateContactInformation(
            UpdateContactInformation.Variables(
                regionId = regionId,
                contactInformation = contactInformation,
                contactInformationActivated = contactInformationActivated,
            ),
        )

    private fun createPreviewQuery(
        regionId: Int,
        contactInformation: String = "",
        contactInformationActivated: Boolean = false,
    ): GetContactInformationMailPreview =
        GetContactInformationMailPreview(
            GetContactInformationMailPreview.Variables(
                regionId = regionId,
                contactInformation = contactInformation,
                contactInformationActivated = contactInformationActivated,
            ),
        )
}
