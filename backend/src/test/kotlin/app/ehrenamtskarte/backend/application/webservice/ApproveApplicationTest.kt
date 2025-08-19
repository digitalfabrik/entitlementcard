package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.GraphqlApiTest
import app.ehrenamtskarte.backend.application.database.ApplicationEntity
import app.ehrenamtskarte.backend.application.database.Applications
import app.ehrenamtskarte.backend.generated.ApproveApplicationStatus
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.TestData
import io.javalin.testtools.JavalinTest
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.EnumSource
import java.time.OffsetDateTime
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

internal class ApproveApplicationTest : GraphqlApiTest() {
    private val regionAdmin = TestAdministrators.EAK_REGION_ADMIN

    @BeforeEach
    fun cleanUp() {
        transaction {
            Applications.deleteAll()
        }
    }

    @Test
    fun `should return a successful response when the application has been approved`() =
        JavalinTest.test(app) { _, client ->
            val applicationId = TestData.createApplication(regionAdmin.regionId)

            val mutation = createMutation(applicationId = applicationId)
            val response = post(client, mutation, regionAdmin.getJwtToken())

            assertEquals(200, response.code)

            val jsonResponse = response.json()

            assertEquals("Approved", jsonResponse.findValue("status").asText())
            assertNotNull(jsonResponse.findValue("statusResolvedDate").asText())

            transaction {
                ApplicationEntity.find { Applications.id eq applicationId }.single().let {
                    assertEquals(ApplicationEntity.Status.Approved, it.status)
                    assertNotNull(it.statusResolvedDate)
                }
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
    fun `should return an error when admin region is different than application region`() =
        JavalinTest.test(app) { _, client ->
            val applicationId = TestData.createApplication(TestAdministrators.EAK_REGION_ADMIN_FREINET.regionId)

            val mutation = createMutation(applicationId = applicationId)
            val response = post(client, mutation, regionAdmin.getJwtToken())

            assertEquals(403, response.code)
        }

    @Disabled("Wait for https://github.com/digitalfabrik/entitlementcard/pull/2373")
    @ParameterizedTest
    @EnumSource(value = ApplicationEntity.Status::class, names = ["Pending"], mode = EnumSource.Mode.EXCLUDE)
    fun `should return an error when application was already processed`(status: ApplicationEntity.Status) =
        JavalinTest.test(app) { _, client ->
            val statusResolvedDate = OffsetDateTime.now().minusDays(1L)
            val applicationId = TestData.createApplication(
                regionId = regionAdmin.regionId,
                status = status,
                statusResolvedDate = statusResolvedDate,
            )

            val mutation = createMutation(applicationId = applicationId)
            val response = post(client, mutation, regionAdmin.getJwtToken())

            assertEquals(200, response.code)

            val jsonResponse = response.json()

            assertEquals("Error INVALID_INPUT occurred.", jsonResponse.findValue("message").textValue())

            transaction {
                // verify that the status has not been updated in the database
                ApplicationEntity.find { Applications.id eq applicationId }.single().let {
                    assertEquals(status, it.status)
                    assertEquals(statusResolvedDate.toInstant(), it.statusResolvedDate?.toInstant())
                }
            }
        }

    private fun createMutation(applicationId: Int): ApproveApplicationStatus {
        val variables = ApproveApplicationStatus.Variables(
            applicationId = applicationId,
        )
        return ApproveApplicationStatus(variables)
    }
}
