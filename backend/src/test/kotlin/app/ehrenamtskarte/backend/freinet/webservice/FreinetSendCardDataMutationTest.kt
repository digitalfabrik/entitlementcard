package app.ehrenamtskarte.backend.freinet.webservice

import app.ehrenamtskarte.backend.IntegrationTest
import app.ehrenamtskarte.backend.db.entities.FreinetAgencies
import app.ehrenamtskarte.backend.db.entities.FreinetAgenciesEntity
import app.ehrenamtskarte.backend.generated.SendCardDataToFreinet
import app.ehrenamtskarte.backend.generated.inputs.FreinetCardWithUserIdInput
import app.ehrenamtskarte.backend.graphql.freinet.exceptions.FreinetCardDataInvalidException
import app.ehrenamtskarte.backend.graphql.freinet.util.FreinetApi
import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.toDataObject
import app.ehrenamtskarte.backend.helper.toErrorObject
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import io.mockk.every
import io.mockk.mockkConstructor
import io.mockk.verify
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import kotlin.test.assertEquals

@JsonIgnoreProperties(ignoreUnknown = true)
data class FreinetCardTransferResultModel(val successCount: Int, val failedUserIds: List<Int>)

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
        every { anyConstructed<FreinetApi>().sendCardInformation(any()) } returns Unit
        every { anyConstructed<FreinetApi>().sendCardInformation(match { it.userId == 99999 }) } throws
            FreinetCardDataInvalidException()
    }

    @Test
    fun `should return an unauthorized error when not logged in`() {
        val response = postGraphQL(createMutation())

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(GraphQLExceptionCode.UNAUTHORIZED, response.toErrorObject().extensions.code)

        verify(exactly = 0) { anyConstructed<FreinetApi>().sendCardInformation(any()) }
    }

    @Test
    fun `should return not implemented error if freinet is not configured`() {
        val response = postGraphQL(createMutation(), TestAdministrators.KOBLENZ_REGION_ADMIN.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(GraphQLExceptionCode.NOT_IMPLEMENTED, response.toErrorObject().extensions.code)

        verify(exactly = 0) { anyConstructed<FreinetApi>().sendCardInformation(any()) }
    }

    @Test
    fun `should return a forbidden error when role is not authorized`() {
        val response = postGraphQL(createMutation(), TestAdministrators.EAK_PROJECT_ADMIN.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(GraphQLExceptionCode.FORBIDDEN, response.toErrorObject().extensions.code)

        verify(exactly = 0) { anyConstructed<FreinetApi>().sendCardInformation(any()) }
    }

    @Test
    fun `should return zero successCount when data transfer is not activated`() {
        val response = postGraphQL(createMutation(), TestAdministrators.EAK_REGION_ADMIN.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)
        val result = response.toDataObject<FreinetCardTransferResultModel>()
        assertEquals(0, result.successCount)
        assertEquals(emptyList(), result.failedUserIds)

        verify(exactly = 0) { anyConstructed<FreinetApi>().sendCardInformation(any()) }
    }

    @Test
    fun `should return successCount of 1 and send card information when data transfer is activated`() {
        val response = postGraphQL(createMutation(), regionAdminFreinet.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)
        val result = response.toDataObject<FreinetCardTransferResultModel>()
        assertEquals(1, result.successCount)
        assertEquals(emptyList(), result.failedUserIds)

        verify(exactly = 1) { anyConstructed<FreinetApi>().sendCardInformation(any()) }
    }

    @Test
    fun `should return correct successCount when sending multiple cards`() {
        val response = postGraphQL(createMutation(userIds = listOf(12345, 67890)), regionAdminFreinet.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)
        val result = response.toDataObject<FreinetCardTransferResultModel>()
        assertEquals(2, result.successCount)
        assertEquals(emptyList(), result.failedUserIds)

        verify(exactly = 2) { anyConstructed<FreinetApi>().sendCardInformation(any()) }
    }

    @Test
    fun `should return failedUserIds when card transfer fails`() {
        val response = postGraphQL(createMutation(userIds = listOf(99999)), regionAdminFreinet.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)
        val result = response.toDataObject<FreinetCardTransferResultModel>()
        assertEquals(0, result.successCount)
        assertEquals(listOf(99999), result.failedUserIds)
    }

    @Test
    fun `should return partial success when one card transfer fails and one succeeds`() {
        val response = postGraphQL(createMutation(userIds = listOf(12345, 99999)), regionAdminFreinet.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)
        val result = response.toDataObject<FreinetCardTransferResultModel>()
        assertEquals(1, result.successCount)
        assertEquals(listOf(99999), result.failedUserIds)

        verify(exactly = 2) { anyConstructed<FreinetApi>().sendCardInformation(any()) }
    }

    private fun createMutation(userIds: List<Int> = listOf(12345)): SendCardDataToFreinet {
        val freinetCards = userIds.map { userId ->
            FreinetCardWithUserIdInput(
                cardType = "Standard",
                expirationDate = "2026-12-31",
                userId = userId,
            )
        }
        val variables = SendCardDataToFreinet.Variables(freinetCards = freinetCards)
        return SendCardDataToFreinet(variables)
    }
}
