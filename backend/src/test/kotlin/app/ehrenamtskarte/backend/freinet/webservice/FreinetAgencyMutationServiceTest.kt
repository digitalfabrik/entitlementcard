package app.ehrenamtskarte.backend.freinet.webservice

import app.ehrenamtskarte.backend.GraphqlApiTest
import app.ehrenamtskarte.backend.freinet.database.FreinetAgencies
import app.ehrenamtskarte.backend.freinet.database.FreinetAgenciesEntity
import app.ehrenamtskarte.backend.generated.UpdateDataTransferToFreinet
import app.ehrenamtskarte.backend.helper.TestAdministrators
import io.javalin.testtools.JavalinTest
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals

internal class FreinetAgencyMutationServiceTest : GraphqlApiTest() {
    private val regionAdminFreinet = TestAdministrators.EAK_REGION_ADMIN_FREINET
    private val projectAdmin = TestAdministrators.EAK_PROJECT_ADMIN

    @Test
    fun `POST returns an unauthorized error when not logged in`() =
        JavalinTest.test(app) { _, client ->
            val mutation = createMutation(9, true)
            val response = post(client, mutation)
            assertEquals(401, response.code)
        }

    @Test
    fun `POST returns not implemented error if freinet is not configured in project`() =
        JavalinTest.test(app) { _, client ->
            val mutation = createMutation(16, true)
            val response = post(client, mutation, TestAdministrators.KOBLENZ_REGION_ADMIN.getJwtToken())
            assertEquals(501, response.code)
        }

    @Test
    fun `POST returns a forbidden error when requesting role is not authorized`() =
        JavalinTest.test(app) { _, client ->
            val mutation = createMutation(9, true)
            val response = post(client, mutation, projectAdmin.getJwtToken())
            assertEquals(403, response.code)
        }

    @Test
    fun `POST returns a successful response and sets dataTransferActivated to true`() =
        JavalinTest.test(app) { _, client ->
            val regionId = 9
            val mutation = createMutation(regionId, true)
            val response = post(client, mutation, regionAdminFreinet.getJwtToken())
            assertEquals(200, response.code)

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
