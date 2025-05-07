package app.ehrenamtskarte.backend.freinet.webservice

import app.ehrenamtskarte.backend.GraphqlApiTest
import app.ehrenamtskarte.backend.common.webservice.EAK_BAYERN_PROJECT
import app.ehrenamtskarte.backend.freinet.database.FreinetAgencies
import app.ehrenamtskarte.backend.freinet.database.FreinetAgenciesEntity
import app.ehrenamtskarte.backend.generated.UpdateDataTransferToFreinet
import app.ehrenamtskarte.backend.helper.TestAdministrators
import io.javalin.testtools.JavalinTest
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals

internal class FreinetAgencyMutationServiceTest : GraphqlApiTest() {
    private val projectId = EAK_BAYERN_PROJECT
    private val regionAdminFreinet = TestAdministrators.EAK_REGION_ADMIN_FREINET
    private val regionAdmin = TestAdministrators.EAK_REGION_ADMIN
    private val projectAdmin = TestAdministrators.EAK_PROJECT_ADMIN

    @Test
    fun `POST returns an unauthorized error when not logged in`() =
        JavalinTest.test(app) { _, client ->
            val mutation = createMutation(9, projectId, true)
            val response = post(client, mutation)
            assertEquals(401, response.code)
        }

    @Test
    fun `POST returns not implemented error if freinet is not configured`() =
        JavalinTest.test(app) { _, client ->
            val mutation = createMutation(16, "koblenz.sozialpass.app", true)
            val response = post(client, mutation, regionAdmin.getJwtToken())
            assertEquals(501, response.code)
        }

    @Test
    fun `POST returns a forbidden error when requesting role is not authorized`() =
        JavalinTest.test(app) { _, client ->
            val mutation = createMutation(9, projectId, true)
            val response = post(client, mutation, projectAdmin.getJwtToken())
            assertEquals(403, response.code)
        }

    @Test
    fun `POST returns a successful response and sets dataTransferActivated to true`() =
        JavalinTest.test(app) {
            _,
            client,
            ->
            val regionId = 9
            val mutation = createMutation(regionId, projectId, true)
            val response = post(client, mutation, regionAdminFreinet.getJwtToken())
            assertEquals(200, response.code)

            transaction {
                val agency = FreinetAgenciesEntity.find { FreinetAgencies.regionId eq regionId }.single()
                assertEquals(true, agency.dataTransferActivated)
            }
        }

    private fun createMutation(
        regionId: Int,
        project: String,
        dataTransferActivated: Boolean,
    ): UpdateDataTransferToFreinet {
        val variables = UpdateDataTransferToFreinet.Variables(
            project = project,
            regionId = regionId,
            dataTransferActivated = dataTransferActivated,
        )
        return UpdateDataTransferToFreinet(variables)
    }
}
