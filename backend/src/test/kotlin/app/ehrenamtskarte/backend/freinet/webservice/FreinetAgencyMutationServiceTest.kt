package app.ehrenamtskarte.backend.freinet.webservice

import app.ehrenamtskarte.backend.IntegrationTest
import app.ehrenamtskarte.backend.db.entities.FreinetAgencies
import app.ehrenamtskarte.backend.db.entities.FreinetAgenciesEntity
import app.ehrenamtskarte.backend.generated.UpdateDataTransferToFreinet
import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.toDataObject
import app.ehrenamtskarte.backend.helper.toErrorObject
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import kotlin.test.assertEquals

internal class FreinetAgencyMutationServiceTest : IntegrationTest() {
    @BeforeEach
    fun cleanUp() {
        transaction {
            // Reset the state for the region used in the success test
            val regionId = 94
            val agency = FreinetAgenciesEntity.find { FreinetAgencies.regionId eq regionId }.singleOrNull()
            agency?.dataTransferActivated = false
        }
    }

    @Test
    fun `should return an unauthorized error when not logged in`() {
        val mutation = createMutation(9, true)
        val response = postGraphQL(mutation)

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals(GraphQLExceptionCode.UNAUTHORIZED, error.extensions.code)
    }

    @Test
    fun `should return not implemented error if freinet is not configured in project`() {
        val mutation = createMutation(16, true)
        val response = postGraphQL(mutation, TestAdministrators.KOBLENZ_REGION_ADMIN.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals(GraphQLExceptionCode.NOT_IMPLEMENTED, error.extensions.code)
    }

    @Test
    fun `should return a forbidden error when role is not authorized`() {
        val mutation = createMutation(9, true)
        val response = postGraphQL(mutation, TestAdministrators.EAK_PROJECT_ADMIN.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals(GraphQLExceptionCode.FORBIDDEN, error.extensions.code)
    }

    @Test
    fun `should set dataTransferActivated to true on successful update`() {
        val regionId = 94
        val mutation = createMutation(regionId, true)
        val response = postGraphQL(mutation, TestAdministrators.EAK_REGION_ADMIN_FREINET.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(true, response.toDataObject())

        transaction {
            val agency = FreinetAgenciesEntity.find { FreinetAgencies.regionId eq regionId }.single()
            assertEquals(true, agency.dataTransferActivated)
        }
    }

    private fun createMutation(regionId: Int, dataTransferActivated: Boolean): UpdateDataTransferToFreinet {
        val variables = UpdateDataTransferToFreinet.Variables(
            regionId = regionId,
            dataTransferActivated = dataTransferActivated,
        )
        return UpdateDataTransferToFreinet(variables)
    }
}
