package app.ehrenamtskarte.backend.freinet.webservice

import app.ehrenamtskarte.backend.IntegrationTest
import app.ehrenamtskarte.backend.generated.GetFreinetAgencyByRegionId
import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.json
import app.ehrenamtskarte.backend.helper.toErrorObject
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import kotlin.test.assertEquals

internal class FreinetAgencyQueryServiceTest : IntegrationTest() {
    @Test
    fun `should return an unauthorized error when not logged in`() {
        val query = createQuery(9)
        val response = postGraphQL(query)

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals(GraphQLExceptionCode.UNAUTHORIZED, error.extensions.code)
    }

    @Test
    fun `should return not implemented error if freinet is not configured in project`() {
        val query = createQuery(16)
        val response = postGraphQL(query, TestAdministrators.KOBLENZ_REGION_ADMIN.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals(GraphQLExceptionCode.NOT_IMPLEMENTED, error.extensions.code)
    }

    @Test
    fun `should return a forbidden error when role is not authorized`() {
        val query = createQuery(9)
        val response = postGraphQL(query, TestAdministrators.EAK_PROJECT_ADMIN.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals(GraphQLExceptionCode.FORBIDDEN, error.extensions.code)
    }

    @Test
    fun `should return null if a region has no agency information`() {
        val query = createQuery(16)
        val response = postGraphQL(query, TestAdministrators.EAK_REGION_ADMIN.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val jsonResponse = response.json()

        assertEquals("null", jsonResponse.findValue("agency").asText())
    }

    @Test
    fun `should return agency information if region has information`() {
        val query = createQuery(94)
        val response = postGraphQL(query, TestAdministrators.EAK_REGION_ADMIN_FREINET.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val jsonResponse = response.json()

        jsonResponse.apply {
            assertEquals("123", findValuesAsText("agencyId").single())
            assertEquals("Freinet Demo", findValuesAsText("agencyName").single())
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
