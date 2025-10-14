package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.IntegrationTest
import app.ehrenamtskarte.backend.db.entities.ApplicationEntity
import app.ehrenamtskarte.backend.db.entities.Applications
import app.ehrenamtskarte.backend.generated.ApproveApplicationStatus
import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.TestData
import app.ehrenamtskarte.backend.helper.json
import app.ehrenamtskarte.backend.helper.toErrorObject
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.EnumSource
import org.springframework.http.HttpStatus
import java.time.OffsetDateTime
import java.time.temporal.ChronoUnit
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

internal class ApproveApplicationTest : IntegrationTest() {
    private val regionAdmin = TestAdministrators.EAK_REGION_ADMIN

    @BeforeEach
    fun cleanUp() {
        transaction {
            Applications.deleteAll()
        }
    }

    @Test
    fun `should return a successful response when the application has been approved`() {
        val applicationId = TestData.createApplication(regionAdmin.regionId)

        val mutation = createMutation(applicationId = applicationId)
        val response = postGraphQL(mutation, regionAdmin.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val data = response.json()

        assertEquals("Approved", data.findValue("status").asText())
        assertNotNull(data.findValue("statusResolvedDate").asText())

        transaction {
            ApplicationEntity.find { Applications.id eq applicationId }.single().let {
                assertEquals(ApplicationEntity.Status.Approved, it.status)
                assertNotNull(it.statusResolvedDate)
            }
        }
    }

    @Test
    fun `should return an error when application not found`() {
        val mutation = createMutation(applicationId = 99)
        val response = postGraphQL(mutation, regionAdmin.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals("Application not found", error.message)
        assertEquals(GraphQLExceptionCode.INVALID_INPUT, error.extensions?.code)
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
    fun `should return an error when admin region is different than application region`() {
        val applicationId = TestData.createApplication(TestAdministrators.EAK_REGION_ADMIN_FREINET.regionId)

        val mutation = createMutation(applicationId = applicationId)
        val response = postGraphQL(mutation, regionAdmin.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals("Insufficient access rights", error.message)
    }

    @ParameterizedTest
    @EnumSource(value = ApplicationEntity.Status::class, names = ["Rejected", "Withdrawn", "ApprovedCardCreated"])
    fun `should return an error if the application status has already been resolved`(status: ApplicationEntity.Status) {
        val statusResolvedDate = OffsetDateTime.now().minusDays(1L).truncatedTo(ChronoUnit.MICROS)
        val applicationId = TestData.createApplication(
            regionId = regionAdmin.regionId,
            status = status,
            statusResolvedDate = statusResolvedDate,
        )

        val mutation = createMutation(applicationId = applicationId)
        val response = postGraphQL(mutation, regionAdmin.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals("Cannot set application to 'Approved', is '$status'", error.message)
        assertEquals(GraphQLExceptionCode.INVALID_INPUT, error.extensions?.code)

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
