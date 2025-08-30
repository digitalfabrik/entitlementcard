package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.GraphqlApiTest
import app.ehrenamtskarte.backend.application.database.ApplicationEntity
import app.ehrenamtskarte.backend.application.database.Applications
import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import app.ehrenamtskarte.backend.generated.RejectApplicationStatus
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.TestData
import app.ehrenamtskarte.backend.mail.Mailer
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.javalin.testtools.JavalinTest
import io.mockk.every
import io.mockk.mockkObject
import io.mockk.verify
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

internal class RejectApplicationTest : GraphqlApiTest() {
    private val regionAdmin = TestAdministrators.EAK_REGION_ADMIN

    @BeforeEach
    fun cleanUp() {
        transaction {
            Applications.deleteAll()
        }
    }

    /**
     * Set up a mock to be able to verify sending emails
     */
    @BeforeEach
    fun mockMailer() {
        mockkObject(Mailer)
        every { Mailer.sendApplicationRejectedMail(any(), any(), any(), any(), any()) } returns Unit
    }

    @Test
    fun `should return a successful response when the application has been rejected`() =
        JavalinTest.test(app) { _, client ->
            val applicationId = TestData.createApplication(regionAdmin.regionId, jsonValue = createTestApplicationJsonField())

            val mutation = createMutation(applicationId = applicationId)
            val response = post(client, mutation, regionAdmin.getJwtToken())

            assertEquals(200, response.code)

            val jsonResponse = response.json()

            assertEquals("Rejected", jsonResponse.findValue("status").asText())
            assertNotNull(jsonResponse.findValue("statusResolvedDate").asText())

            transaction {
                ApplicationEntity.find { Applications.id eq applicationId }.single().let {
                    assertEquals(ApplicationEntity.Status.Rejected, it.status)
                    assertNotNull(it.statusResolvedDate)
                }
            }

            verify(exactly = 1) {
                Mailer.sendApplicationRejectedMail(
                    any(),
                    any(),
                    "John Doe",
                    "johndoe@example.com",
                    "dummy",
                )
            }
        }

    private fun createTestApplicationJsonField(): String {
        val addressFields = listOf(
            JsonField("street", Type.String, "Example Street"),
            JsonField("houseNumber", Type.String, "123"),
            JsonField("postalCode", Type.String, "80331"),
            JsonField("location", Type.String, "München"),
            JsonField("country", Type.String, "Deutschland"),
        )

        val personalDataFields = listOf(
            JsonField("forenames", Type.String, "John"),
            JsonField("surname", Type.String, "Doe"),
            JsonField("dateOfBirth", Type.Date, "1990-01-01"),
            JsonField("emailAddress", Type.String, "johndoe@example.com"),
            JsonField("telephone", Type.String, "123456789"),
            JsonField("address", Type.Array, addressFields),
        )

        val applicationDetailsFields = listOf(
            JsonField("applicationType", Type.String, "FIRST_APPLICATION"),
            JsonField("cardType", Type.String, "BLUE"),
            JsonField("givenInformationIsCorrectAndComplete", Type.Boolean, true),
            JsonField("hasAcceptedEmailUsage", Type.Boolean, true),
            JsonField("hasAcceptedPrivacyPolicy", Type.Boolean, true),
            JsonField("wantsDigitalCard", Type.Boolean, true),
            JsonField("wantsPhysicalCard", Type.Boolean, false),
        )

        val applicationFields = listOf(
            JsonField("personalData", Type.Array, personalDataFields),
            JsonField("applicationDetails", Type.Array, applicationDetailsFields),
        )

        val objectMapper = jacksonObjectMapper()
        return objectMapper.writeValueAsString(JsonField("application", Type.Array, applicationFields))
    }

    private fun createMutation(applicationId: Int): RejectApplicationStatus {
        val variables = RejectApplicationStatus.Variables(
            applicationId = applicationId,
            rejectionMessage = "dummy",
        )
        return RejectApplicationStatus(variables)
    }
}
