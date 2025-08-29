package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.GraphqlApiTest
import app.ehrenamtskarte.backend.application.database.ApplicationEntity
import app.ehrenamtskarte.backend.application.database.ApplicationVerificationEntity
import app.ehrenamtskarte.backend.application.database.ApplicationVerifications
import app.ehrenamtskarte.backend.application.database.Applications
import app.ehrenamtskarte.backend.generated.DeleteApplication
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.TestData
import io.javalin.testtools.JavalinTest
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertNull
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.EnumSource
import kotlin.test.assertEquals

internal class DeleteApplicationTest : GraphqlApiTest() {
    private val regionAdmin = TestAdministrators.EAK_REGION_ADMIN

    @BeforeEach
    fun cleanUp() {
        transaction {
            ApplicationVerifications.deleteAll()
            Applications.deleteAll()
        }
    }

    @Test
    fun `should return an error when application not found`() =
        JavalinTest.test(app) { _, client ->
            val mutation = createMutation(applicationId = 99)
            val response = post(client, mutation, regionAdmin.getJwtToken())

            assertEquals(200, response.code)

            val jsonResponse = response.json()

            assertEquals("Error INVALID_INPUT occurred.", jsonResponse.findValue("message").textValue())
            assertEquals("Application not found", jsonResponse.findValue("reason").textValue())
        }

    @Test
    fun `should return an error when request not authorized`() =
        JavalinTest.test(app) { _, client ->
            val applicationId = TestData.createApplication(regionAdmin.regionId)

            val mutation = createMutation(applicationId = applicationId)
            val response = post(client, mutation)

            assertEquals(401, response.code)
        }

    @Test
    fun `should return an error when admin attempts to delete an application in another region`() =
        JavalinTest.test(app) { _, client ->
            val applicationId = TestData.createApplication(regionAdmin.regionId)

            val mutation = createMutation(applicationId = applicationId)
            val response = post(client, mutation, TestAdministrators.EAK_REGION_ADMIN_FREINET.getJwtToken())

            assertEquals(403, response.code)
        }

    @Test
    fun `should return an error when admin attempts to delete a pending application`() =
        JavalinTest.test(app) { _, client ->
            val applicationId = TestData.createApplication(regionAdmin.regionId)

            val mutation = createMutation(applicationId = applicationId)
            val response = post(client, mutation, regionAdmin.getJwtToken())

            assertEquals(200, response.code)

            val jsonResponse = response.json()

            assertEquals("Error INVALID_INPUT occurred.", jsonResponse.findValue("message").textValue())
            assertEquals(
                "Application cannot be deleted while it is in a pending state",
                jsonResponse.findValue("reason").textValue(),
            )
        }

    @ParameterizedTest
    @EnumSource(value = ApplicationEntity.Status::class, names = ["Pending"], mode = EnumSource.Mode.EXCLUDE)
    fun `should return a successful response when the application has been deleted`(status: ApplicationEntity.Status) =
        JavalinTest.test(app) { _, client ->
            val applicationId = TestData.createApplication(regionAdmin.regionId, status = status)
            TestData.createApplicationVerification(applicationId)

            val mutation = createMutation(applicationId = applicationId)
            val response = post(client, mutation, regionAdmin.getJwtToken())

            assertEquals(200, response.code)

            val jsonResponse = response.json()

            assertEquals(true, jsonResponse.path("data").path("deleted").asBoolean())

            transaction {
                assertNull(ApplicationEntity.findById(applicationId))

                val verifications = ApplicationVerificationEntity.find {
                    ApplicationVerifications.applicationId eq applicationId
                }
                assertEquals(0, verifications.count())
            }
        }

    private fun createMutation(applicationId: Int): DeleteApplication {
        val variables = DeleteApplication.Variables(
            applicationId = applicationId,
        )
        return DeleteApplication(variables)
    }
}
