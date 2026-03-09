package app.ehrenamtskarte.backend.freinet.webservice

import app.ehrenamtskarte.backend.IntegrationTest
import app.ehrenamtskarte.backend.db.entities.FreinetAgencies
import app.ehrenamtskarte.backend.db.entities.FreinetAgenciesEntity
import app.ehrenamtskarte.backend.generated.SendCardDataToFreinet
import app.ehrenamtskarte.backend.generated.inputs.FreinetCardInput
import app.ehrenamtskarte.backend.graphql.freinet.util.FreinetApi
import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.toDataObject
import app.ehrenamtskarte.backend.helper.toErrorObject
import io.mockk.every
import io.mockk.mockkConstructor
import io.mockk.verify
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import kotlin.test.assertEquals

internal class FreinetSendCardDataMutationTest : IntegrationTest() {
    private val regionAdminFreinet = TestAdministrators.EAK_REGION_ADMIN_FREINET

    @BeforeEach
    fun activateDataTransfer() {
        transaction {
            val agency = FreinetAgenciesEntity.find { FreinetAgencies.regionId eq regionAdminFreinet.regionId }.single()
            agency.dataTransferActivated = true
        }
    }

    @BeforeEach
    fun mockFreinetApi() {
        mockkConstructor(FreinetApi::class)
        every { anyConstructed<FreinetApi>().sendCardInformation(any(), any()) } returns Unit
    }

    @Test
    fun `should return an unauthorized error when not logged in`() {
        val mutation = createMutation()
        val response = postGraphQL(mutation)

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals(GraphQLExceptionCode.UNAUTHORIZED, error.extensions.code)

        verify(exactly = 0) { anyConstructed<FreinetApi>().sendCardInformation(any(), any()) }
    }

    @Test
    fun `should return not implemented error if freinet is not configured`() {
        val mutation = createMutation()
        val response = postGraphQL(mutation, TestAdministrators.KOBLENZ_REGION_ADMIN.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals(GraphQLExceptionCode.NOT_IMPLEMENTED, error.extensions.code)

        verify(exactly = 0) { anyConstructed<FreinetApi>().sendCardInformation(any(), any()) }
    }

    @Test
    fun `should return a forbidden error when role is not authorized`() {
        val mutation = createMutation()
        val response = postGraphQL(mutation, TestAdministrators.EAK_PROJECT_ADMIN.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals(GraphQLExceptionCode.FORBIDDEN, error.extensions.code)

        verify(exactly = 0) { anyConstructed<FreinetApi>().sendCardInformation(any(), any()) }
    }

    @Test
    fun `should return false when data transfer is not activated`() {
        val mutation = createMutation()
        val response = postGraphQL(mutation, TestAdministrators.EAK_REGION_ADMIN.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(false, response.toDataObject())

        verify(exactly = 0) { anyConstructed<FreinetApi>().sendCardInformation(any(), any()) }
    }

    @Test
    fun `should return true and send card information when data transfer is activated`() {
        val mutation = createMutation()
        val response = postGraphQL(mutation, regionAdminFreinet.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(true, response.toDataObject())

        verify { anyConstructed<FreinetApi>().sendCardInformation(12345, any()) }
    }

    private fun createMutation(userId: Int = 12345): SendCardDataToFreinet {
        val freinetCard = FreinetCardInput(
            cardType = "Standard",
            expirationDate = "2026-12-31",
        )
        val variables = SendCardDataToFreinet.Variables(
            userId = userId,
            freinetCard = freinetCard,
        )
        return SendCardDataToFreinet(variables)
    }
}
