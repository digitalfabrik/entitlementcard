package app.ehrenamtskarte.backend.regions

import app.ehrenamtskarte.backend.IntegrationTest
import app.ehrenamtskarte.backend.generated.GetApplicationConfirmationMailPreview
import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.toDataObject
import app.ehrenamtskarte.backend.helper.toErrorObject
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

internal class ApplicationConfirmationMailPreviewTest : IntegrationTest() {
    @Test
    fun `should return an unauthorized error when not logged in`() {
        val response = postGraphQL(createQuery(16))

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(GraphQLExceptionCode.UNAUTHORIZED, response.toErrorObject().extensions.code)
    }

    @Test
    fun `should return a forbidden error when role is not authorized`() {
        val response = postGraphQL(createQuery(16), TestAdministrators.EAK_REGION_MANAGER.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(GraphQLExceptionCode.FORBIDDEN, response.toErrorObject().extensions.code)
    }

    @Test
    fun `should return a forbidden error for a different region`() {
        val response = postGraphQL(createQuery(94), TestAdministrators.EAK_REGION_ADMIN.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(GraphQLExceptionCode.FORBIDDEN, response.toErrorObject().extensions.code)
    }

    @Test
    fun `should return an error if the note is too long`() {
        val response = postGraphQL(
            createQuery(16, "a".repeat(1001), true),
            TestAdministrators.EAK_REGION_ADMIN.getJwtToken(),
        )

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(
            GraphQLExceptionCode.INVALID_APPLICATION_CONFIRMATION_NOTE_SIZE,
            response.toErrorObject().extensions.code,
        )
    }

    @Test
    fun `should return the mail html filled with example data`() {
        val response = postGraphQL(createQuery(16), TestAdministrators.EAK_REGION_ADMIN.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val html = response.toDataObject<String>()

        assertTrue(html.contains("<p>Sehr geehrte/r Erika Musterfrau,</p>"))
        assertTrue(html.contains("href=\"https://test.app/antrag-einsehen/beispiel\""))
        assertTrue(html.contains("Ihr Team der Ehrenamtskarte Bayern"))
    }

    @Test
    fun `should include the given note only if it is activated and not blank`() {
        val note = "Bitte bringen Sie Ihren Ausweis mit."
        val token = TestAdministrators.EAK_REGION_ADMIN.getJwtToken()

        val htmlWithNote = postGraphQL(createQuery(16, note, true), token).toDataObject<String>()
        val htmlWithDeactivatedNote = postGraphQL(createQuery(16, note, false), token).toDataObject<String>()
        val htmlWithBlankNote = postGraphQL(createQuery(16, " ", true), token).toDataObject<String>()

        assertTrue(htmlWithNote.contains(Regex("<blockquote>\\s*<p>$note</p>\\s*</blockquote>")))
        assertFalse(htmlWithDeactivatedNote.contains(note))
        assertFalse(htmlWithBlankNote.contains("<blockquote>"))
    }

    @Test
    fun `should escape html in the note`() {
        val response = postGraphQL(
            createQuery(16, "<script>alert(1)</script>", true),
            TestAdministrators.EAK_REGION_ADMIN.getJwtToken(),
        )

        val html = response.toDataObject<String>()

        assertFalse(html.contains("<script>"))
        assertTrue(html.contains("&lt;script&gt;"))
    }

    private fun createQuery(
        regionId: Int,
        note: String = "",
        noteActivated: Boolean = false,
    ): GetApplicationConfirmationMailPreview =
        GetApplicationConfirmationMailPreview(
            GetApplicationConfirmationMailPreview.Variables(
                regionId = regionId,
                applicationConfirmationNote = note,
                applicationConfirmationNoteActivated = noteActivated,
            ),
        )
}
