package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.IntegrationTest
import app.ehrenamtskarte.backend.db.entities.ApplicationEntity
import app.ehrenamtskarte.backend.db.entities.ApplicationVerificationEntity
import app.ehrenamtskarte.backend.db.entities.ApplicationVerifications
import app.ehrenamtskarte.backend.db.entities.Applications
import app.ehrenamtskarte.backend.generated.DeleteApplication
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.TestData
import app.ehrenamtskarte.backend.helper.toDataObject
import app.ehrenamtskarte.backend.helper.toErrorObject
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.EnumSource
import org.springframework.http.HttpStatus
import kotlin.test.assertEquals

internal class DeleteApplicationTest : IntegrationTest() {
    private val regionAdmin = TestAdministrators.EAK_REGION_ADMIN

    @BeforeEach
    fun cleanUp() {
        transaction {
            ApplicationVerifications.deleteAll()
            Applications.deleteAll()
        }
    }

    @Test
    fun `should return an error when application not found`() {
        val mutation = createMutation(applicationId = 99)
        val response = postGraphQL(mutation, regionAdmin.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals("Error INVALID_INPUT occurred.", error.message)
        assertEquals("Application not found", error.extensions?.reason)
    }

    @Test
    fun `should return an error when request not authorized`() {
        val applicationId = TestData.createApplication(regionAdmin.regionId)

        val mutation = createMutation(applicationId = applicationId)
        val response = postGraphQL(mutation)

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals("Authorization token expired, invalid or missing", error.message)
    }

    @Test
    fun `should return an error when admin attempts to delete an application in another region`() {
        val applicationId = TestData.createApplication(regionAdmin.regionId)

        val mutation = createMutation(applicationId = applicationId)
        val response = postGraphQL(mutation, TestAdministrators.EAK_REGION_ADMIN_FREINET.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals("Insufficient access rights", error.message)
    }

    @Test
    fun `should return an error when admin attempts to delete a pending application`() {
        val applicationId = TestData.createApplication(regionAdmin.regionId)

        val mutation = createMutation(applicationId = applicationId)
        val response = postGraphQL(mutation, regionAdmin.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals("Error INVALID_INPUT occurred.", error.message)
        assertEquals(
            "Application cannot be deleted while it is in a pending state",
            error.extensions?.reason,
        )
    }

    @ParameterizedTest
    @EnumSource(value = ApplicationEntity.Status::class, names = ["Pending"], mode = EnumSource.Mode.EXCLUDE)
    fun `should return a successful response when the application has been deleted`(status: ApplicationEntity.Status) {
        val applicationId = TestData.createApplication(regionAdmin.regionId, status = status)
        TestData.createApplicationVerification(applicationId)

        val mutation = createMutation(applicationId = applicationId)
        val response = postGraphQL(mutation, regionAdmin.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(true, response.toDataObject<Boolean>())

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
