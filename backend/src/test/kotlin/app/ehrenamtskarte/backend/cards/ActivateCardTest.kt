package app.ehrenamtskarte.backend.cards

import app.ehrenamtskarte.backend.IntegrationTest
import app.ehrenamtskarte.backend.db.entities.CardEntity
import app.ehrenamtskarte.backend.db.entities.Cards
import app.ehrenamtskarte.backend.generated.ActivateCard
import app.ehrenamtskarte.backend.generated.activatecard.CardActivationResultModel
import app.ehrenamtskarte.backend.generated.enums.ActivationState
import app.ehrenamtskarte.backend.graphql.cards.hashActivationSecret
import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode
import app.ehrenamtskarte.backend.helper.SampleCards
import app.ehrenamtskarte.backend.helper.SampleCards.hash
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.TestData
import app.ehrenamtskarte.backend.helper.toDataObject
import app.ehrenamtskarte.backend.helper.toErrorObject
import io.ktor.util.encodeBase64
import org.jetbrains.exposed.v1.jdbc.deleteAll
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import java.time.LocalDate
import java.time.ZoneOffset
import kotlin.random.Random
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import kotlin.test.fail

internal class ActivateCardTest : IntegrationTest() {
    private val eakRegionAdmin = TestAdministrators.EAK_REGION_ADMIN

    @BeforeEach
    fun cleanUp() {
        transaction {
            Cards.deleteAll()
        }
    }

    @Test
    fun `should return an error when project does not exist`() {
        val mutation = activateCardMutation(
            project = "non-existent.sozialpass.app",
            cardInfoHashBase64 = Random.nextBytes(20).encodeBase64(),
            activationSecretBase64 = Random.nextBytes(20).encodeBase64(),
        )
        val response = postGraphQL(mutation)

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals("Project 'non-existent.sozialpass.app' not found", error.message)
        assertEquals(GraphQLExceptionCode.PROJECT_NOT_FOUND, error.extensions.code)
    }

    @Test
    fun `should return successful activation result when the card is valid`() {
        val cardInfoHash = SampleCards.bavarianStandard().hash()

        val rawActivationSecret = Random.nextBytes(20)
        val activationSecretHash = hashActivationSecret(rawActivationSecret)

        val cardId = TestData.createDynamicCard(
            cardInfoHash,
            activationSecretHash,
            issuerId = eakRegionAdmin.id,
        )

        val mutation = activateCardMutation(
            cardInfoHashBase64 = cardInfoHash.encodeBase64(),
            activationSecretBase64 = rawActivationSecret.encodeBase64(),
        )
        val response = postGraphQL(mutation)

        assertEquals(HttpStatus.OK, response.statusCode)

        val activationResult = response.toDataObject<CardActivationResultModel>()

        assertEquals(ActivationState.SUCCESS, activationResult.activationState)
        assertNotNull(activationResult.totpSecret)

        transaction {
            val card = CardEntity.findById(cardId) ?: fail("Card not found")

            assertNotNull(card.firstActivationDate)
            assertEquals(activationResult.totpSecret, card.totpSecret?.encodeBase64())
        }
    }

    @Test
    fun `should return not_found state when the card is static`() {
        val cardInfoHash = SampleCards.bavarianStandard().hash()

        val cardId = TestData.createStaticCard(cardInfoHash, issuerId = eakRegionAdmin.id)

        val mutation = activateCardMutation(
            cardInfoHashBase64 = cardInfoHash.encodeBase64(),
            activationSecretBase64 = Random.nextBytes(20).encodeBase64(),
        )
        val response = postGraphQL(mutation)

        assertEquals(HttpStatus.OK, response.statusCode)

        val activationResult = response.toDataObject<CardActivationResultModel>()

        assertEquals(ActivationState.NOT_FOUND, activationResult.activationState)
        assertNull(activationResult.totpSecret)

        transaction {
            val card = CardEntity.findById(cardId) ?: fail("Card not found")

            assertNull(card.firstActivationDate)
            assertNull(card.totpSecret)
        }
    }

    @Test
    fun `should return not_found state when the card not found`() {
        val mutation = activateCardMutation(
            cardInfoHashBase64 = Random.nextBytes(20).encodeBase64(),
            activationSecretBase64 = Random.nextBytes(20).encodeBase64(),
        )
        val response = postGraphQL(mutation)

        assertEquals(HttpStatus.OK, response.statusCode)

        val activationResult = response.toDataObject<CardActivationResultModel>()

        assertEquals(ActivationState.NOT_FOUND, activationResult.activationState)
        assertNull(activationResult.totpSecret)
    }

    @Test
    fun `should return wrong_secret state when the activation secret is incorrect`() {
        val cardInfoHash = SampleCards.bavarianStandard().hash()

        val rawActivationSecret = Random.nextBytes(20)
        val activationSecretHash = hashActivationSecret(rawActivationSecret)

        val cardId = TestData.createDynamicCard(
            cardInfoHash,
            activationSecretHash,
            issuerId = eakRegionAdmin.id,
        )

        val mutation = activateCardMutation(
            cardInfoHashBase64 = cardInfoHash.encodeBase64(),
            activationSecretBase64 = Random.nextBytes(20).encodeBase64(),
        )
        val response = postGraphQL(mutation)

        assertEquals(HttpStatus.OK, response.statusCode)

        val activationResult = response.toDataObject<CardActivationResultModel>()

        assertEquals(ActivationState.WRONG_SECRET, activationResult.activationState)
        assertNull(activationResult.totpSecret)

        transaction {
            val card = CardEntity.findById(cardId) ?: fail("Card not found")

            assertNull(card.firstActivationDate)
            assertNull(card.totpSecret)
        }
    }

    @Test
    fun `should return expired state when the card is expired`() {
        val cardInfoHash = SampleCards.bavarianStandard().hash()

        val rawActivationSecret = Random.nextBytes(20)
        val activationSecretHash = hashActivationSecret(rawActivationSecret)

        val cardId = TestData.createDynamicCard(
            cardInfoHash,
            activationSecretHash,
            issuerId = eakRegionAdmin.id,
            expirationDay = LocalDate.now().minusDays(1L).toEpochDay(),
        )

        val mutation = activateCardMutation(
            cardInfoHashBase64 = cardInfoHash.encodeBase64(),
            activationSecretBase64 = rawActivationSecret.encodeBase64(),
        )
        val response = postGraphQL(mutation)

        assertEquals(HttpStatus.OK, response.statusCode)

        val activationResult = response.toDataObject<CardActivationResultModel>()

        assertEquals(ActivationState.EXPIRED, activationResult.activationState)
        assertNull(activationResult.totpSecret)

        transaction {
            val card = CardEntity.findById(cardId) ?: fail("Card not found")

            assertNull(card.firstActivationDate)
            assertNull(card.totpSecret)
        }
    }

    @Test
    fun `should return revoked state when the card is revoked`() {
        val cardInfoHash = SampleCards.bavarianStandard().hash()

        val rawActivationSecret = Random.nextBytes(20)
        val activationSecretHash = hashActivationSecret(rawActivationSecret)

        val cardId = TestData.createDynamicCard(
            cardInfoHash,
            activationSecretHash,
            issuerId = eakRegionAdmin.id,
            revoked = true,
        )

        val mutation = activateCardMutation(
            cardInfoHashBase64 = cardInfoHash.encodeBase64(),
            activationSecretBase64 = rawActivationSecret.encodeBase64(),
        )
        val response = postGraphQL(mutation)

        assertEquals(HttpStatus.OK, response.statusCode)

        val activationResult = response.toDataObject<CardActivationResultModel>()

        assertEquals(ActivationState.REVOKED, activationResult.activationState)
        assertNull(activationResult.totpSecret)

        transaction {
            val card = CardEntity.findById(cardId) ?: fail("Card not found")

            assertNull(card.firstActivationDate)
            assertNull(card.totpSecret)
        }
    }

    @Test
    fun `should return successful activation result when the card has already been activated and overwrite = true`() {
        val cardInfoHash = SampleCards.bavarianStandard().hash()

        val rawActivationSecret = Random.nextBytes(20)
        val activationSecretHash = hashActivationSecret(rawActivationSecret)

        val firstActivationDate = LocalDate.now().atStartOfDay().toInstant(ZoneOffset.UTC)

        val cardId = TestData.createDynamicCard(
            cardInfoHash,
            activationSecretHash,
            issuerId = eakRegionAdmin.id,
            totpSecret = Random.nextBytes(20),
            firstActivationDate = firstActivationDate,
        )

        val mutation = activateCardMutation(
            cardInfoHashBase64 = cardInfoHash.encodeBase64(),
            activationSecretBase64 = rawActivationSecret.encodeBase64(),
            overwrite = true,
        )
        val response = postGraphQL(mutation)

        assertEquals(HttpStatus.OK, response.statusCode)

        val activationResult = response.toDataObject<CardActivationResultModel>()

        assertEquals(ActivationState.SUCCESS, activationResult.activationState)
        assertNotNull(activationResult.totpSecret)

        transaction {
            val card = CardEntity.findById(cardId) ?: fail("Card not found")

            // first activation date should not change
            assertEquals(firstActivationDate, card.firstActivationDate)
            // new totp secret should be generated
            assertEquals(activationResult.totpSecret, card.totpSecret?.encodeBase64())
        }
    }

    @Test
    fun `should return did_not_overwrite_existing state if card has already been activated and overwrite = false`() {
        val cardInfoHash = SampleCards.bavarianStandard().hash()

        val rawActivationSecret = Random.nextBytes(20)
        val activationSecretHash = hashActivationSecret(rawActivationSecret)

        val firstActivationDate = LocalDate.now().atStartOfDay().toInstant(ZoneOffset.UTC)
        val firstTotpSecret = Random.nextBytes(20)

        val cardId = TestData.createDynamicCard(
            cardInfoHash,
            activationSecretHash,
            issuerId = eakRegionAdmin.id,
            totpSecret = firstTotpSecret,
            firstActivationDate = firstActivationDate,
        )

        val mutation = activateCardMutation(
            cardInfoHashBase64 = cardInfoHash.encodeBase64(),
            activationSecretBase64 = rawActivationSecret.encodeBase64(),
            overwrite = false,
        )
        val response = postGraphQL(mutation)

        assertEquals(HttpStatus.OK, response.statusCode)

        val activationResult = response.toDataObject<CardActivationResultModel>()

        assertEquals(ActivationState.DID_NOT_OVERWRITE_EXISTING, activationResult.activationState)
        assertNull(activationResult.totpSecret)

        transaction {
            val card = CardEntity.findById(cardId) ?: fail("Card not found")

            // first activation date should not change
            assertEquals(firstActivationDate, card.firstActivationDate)
            // totp secret should not change
            assertEquals(firstTotpSecret.encodeBase64(), card.totpSecret?.encodeBase64())
        }
    }

    private fun activateCardMutation(
        project: String = "bayern.ehrenamtskarte.app",
        cardInfoHashBase64: String,
        activationSecretBase64: String,
        overwrite: Boolean = false,
    ): ActivateCard {
        val variables = ActivateCard.Variables(
            project = project,
            cardInfoHashBase64 = cardInfoHashBase64,
            activationSecretBase64 = activationSecretBase64,
            overwrite = overwrite,
        )
        return ActivateCard(variables)
    }
}
