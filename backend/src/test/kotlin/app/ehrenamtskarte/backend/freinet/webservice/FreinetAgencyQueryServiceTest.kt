package app.ehrenamtskarte.backend.freinet.webservice

import app.ehrenamtskarte.backend.GraphqlApiTest
import app.ehrenamtskarte.backend.generated.GetFreinetAgencyByRegionId
import app.ehrenamtskarte.backend.helper.TestAdministrators
import io.javalin.testtools.JavalinTest
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals

internal class FreinetAgencyQueryServiceTest : GraphqlApiTest() {
    private val regionAdminFreinet = TestAdministrators.EAK_REGION_ADMIN_FREINET
    private val regionAdmin = TestAdministrators.EAK_REGION_ADMIN
    private val projectAdmin = TestAdministrators.EAK_PROJECT_ADMIN

    @Test
    fun `POST returns an unauthorized error when not logged in`() =
        JavalinTest.test(app) { _, client ->
            val query = createQuery(9)
            val response = post(client, query)
            assertEquals(401, response.code)
        }

    @Test
    fun `POST returns not implemented error if freinet is not configured in project`() =
        JavalinTest.test(app) { _, client ->
            val query = createQuery(16)
            val response = post(client, query, TestAdministrators.KOBLENZ_REGION_ADMIN.getJwtToken())
            assertEquals(501, response.code)
        }

    @Test
    fun `POST returns a forbidden error when requesting role is not authorized`() =
        JavalinTest.test(app) { _, client ->
            val query = createQuery(9)
            val response = post(client, query, projectAdmin.getJwtToken())
            assertEquals(403, response.code)
        }

    @Test
    fun `POST returns a successful response without information if a region has no agency information`() =
        JavalinTest.test(app) { _, client ->
            val query = createQuery(16)
            val response = post(client, query, regionAdmin.getJwtToken())
            assertEquals(200, response.code)
            val jsonResponse = response.json()
            jsonResponse.apply {
                assertEquals("null", findValuesAsText("agency").single())
            }
        }

    @Test
    fun `POST returns a successful response with agency information if region has information`() =
        JavalinTest.test(app) { _, client ->
            val query = createQuery(9)
            val response = post(client, query, regionAdminFreinet.getJwtToken())
            assertEquals(200, response.code)
            val jsonResponse = response.json()
            jsonResponse.apply {
                assertEquals("123", findValuesAsText("agencyId").single())
                assertEquals("Demo Mandant", findValuesAsText("agencyName").single())
                assertEquals("testKey", findValuesAsText("apiAccessKey").single())
                assertEquals("false", findValuesAsText("dataTransferActivated").single())
            }
        }

    private fun createQuery(regionId: Int): GetFreinetAgencyByRegionId {
        val variables = GetFreinetAgencyByRegionId.Variables(
            regionId = regionId,
        )
        return GetFreinetAgencyByRegionId(variables)
    }
}
