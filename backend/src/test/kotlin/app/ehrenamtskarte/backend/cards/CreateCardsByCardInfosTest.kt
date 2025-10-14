package app.ehrenamtskarte.backend.cards

import app.ehrenamtskarte.backend.IntegrationTest
import app.ehrenamtskarte.backend.db.entities.CardEntity
import app.ehrenamtskarte.backend.db.entities.Cards
import app.ehrenamtskarte.backend.db.entities.CodeType
import app.ehrenamtskarte.backend.generated.CreateCardsByCardInfos
import app.ehrenamtskarte.backend.generated.createcardsbycardinfos.CardCreationResultModel
import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode
import app.ehrenamtskarte.backend.helper.SampleCards
import app.ehrenamtskarte.backend.helper.SampleCards.getEncoded
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.toDataObject
import app.ehrenamtskarte.backend.helper.toErrorObject
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNotNull
import kotlin.test.assertNull

internal class CreateCardsByCardInfosTest : IntegrationTest() {
    private val projectAdmin = TestAdministrators.EAK_PROJECT_ADMIN
    private val regionAdmin = TestAdministrators.EAK_REGION_ADMIN

    @BeforeEach
    fun cleanUp() {
        transaction {
            Cards.deleteAll()
        }
    }

    @Test
    fun `should return an error when the auth token is missing`() {
        val mutation = createMutation(encodedCardInfo = "dummy")
        val response = postGraphQL(mutation)

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals("Authorization token expired, invalid or missing", error.message)
    }

    @Test
    fun `should return an error when the user is not allowed to create cards`() {
        val encodedCardInfo = SampleCards.bavarianStandard().getEncoded()
        val mutation = createMutation(encodedCardInfo = encodedCardInfo)
        val response = postGraphQL(mutation, projectAdmin.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals("Insufficient access rights", error.message)
    }

    @Test
    fun `should return an error when encoded card info can't be parsed`() {
        val mutation = createMutation(encodedCardInfo = "dummy")
        val response = postGraphQL(mutation, regionAdmin.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals("Failed to parse encodedCardInfo", error.message)
        assertEquals(GraphQLExceptionCode.INVALID_INPUT, error.extensions?.code)
    }

    @Test
    fun `should return a successful response when static and dynamic cards are created without an application`() {
        val encodedCardInfo = SampleCards.bavarianStandard().getEncoded()
        val mutation = createMutation(encodedCardInfo = encodedCardInfo)
        val response = postGraphQL(mutation, regionAdmin.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val result = response.toDataObject<List<CardCreationResultModel>>().single()

        assertNotNull(result.dynamicActivationCode)
        assertNotNull(result.staticVerificationCode)

        transaction {
            assertEquals(2, Cards.selectAll().count())

            CardEntity.find { Cards.codeType eq CodeType.DYNAMIC }.single().let {
                assertNotNull(it.activationSecretHash)
                assertNull(it.totpSecret)
                assertEquals(365 * 40, it.expirationDay)
                assertFalse(it.revoked)
                assertEquals(regionAdmin.regionId, it.regionId.value)
                assertEquals(1, it.issuerId!!.value)
                assertNotNull(it.cardInfoHash)
                assertNull(it.firstActivationDate)
                assertNull(it.startDay)
                assertNull(it.entitlementId)
            }

            CardEntity.find { Cards.codeType eq CodeType.STATIC }.single().let {
                assertNull(it.activationSecretHash)
                assertNull(it.totpSecret)
                assertEquals(365 * 40, it.expirationDay)
                assertFalse(it.revoked)
                assertEquals(regionAdmin.regionId, it.regionId.value)
                assertEquals(1, it.issuerId!!.value)
                assertNotNull(it.cardInfoHash)
                assertNull(it.firstActivationDate)
                assertNull(it.startDay)
                assertNull(it.entitlementId)
            }
        }
    }

    private fun createMutation(
        encodedCardInfo: String,
        generateStaticCode: Boolean = true,
        applicationIdToMarkAsProcessed: Int? = null,
    ): CreateCardsByCardInfos {
        val variables = CreateCardsByCardInfos.Variables(
            encodedCardInfos = listOf(encodedCardInfo),
            generateStaticCodes = generateStaticCode,
            applicationIdToMarkAsProcessed = applicationIdToMarkAsProcessed,
        )
        return CreateCardsByCardInfos(variables)
    }
}
