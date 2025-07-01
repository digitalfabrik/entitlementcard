package app.ehrenamtskarte.backend.cards

import app.ehrenamtskarte.backend.GraphqlApiTest
import app.ehrenamtskarte.backend.cards.database.CardEntity
import app.ehrenamtskarte.backend.cards.database.Cards
import app.ehrenamtskarte.backend.cards.service.CardActivator
import app.ehrenamtskarte.backend.generated.ActivateCard
import app.ehrenamtskarte.backend.generated.activatecard.CardActivationResultModel
import app.ehrenamtskarte.backend.generated.enums.ActivationState
import app.ehrenamtskarte.backend.helper.SampleCards
import app.ehrenamtskarte.backend.helper.SampleCards.hash
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.TestData
import io.javalin.testtools.JavalinTest
import io.ktor.util.encodeBase64
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertNotNull
import org.junit.jupiter.api.assertNull
import java.time.LocalDate
import java.time.ZoneOffset
import kotlin.random.Random
import kotlin.test.assertEquals

internal class ActivateCardTest : GraphqlApiTest() {
    private val eakRegionAdmin = TestAdministrators.EAK_REGION_ADMIN

    @BeforeEach
    fun cleanUp() {
        transaction {
            Cards.deleteAll()
        }
    }

    @Test
    fun `should return error response when the project not found`() =
        JavalinTest.test(app) { _, client ->
            val mutation = activateCardMutation(
                project = "non-existent.sozialpass.app",
                cardInfoHashBase64 = Random.nextBytes(20).encodeBase64(),
                activationSecretBase64 = Random.nextBytes(20).encodeBase64(),
            )
            val response = post(client, mutation)

            assertEquals(404, response.code)
        }

    @Test
    fun `should return successful activation result when the card is valid`() =
        JavalinTest.test(app) { _, client ->
            val cardInfoHash = SampleCards.BavarianStandard.hash()

            val rawActivationSecret = Random.nextBytes(20)
            val activationSecretHash = CardActivator.hashActivationSecret(rawActivationSecret)

            val cardId = TestData.createDynamicCard(
                cardInfoHash,
                activationSecretHash,
                issuerId = eakRegionAdmin.id,
            )

            val mutation = activateCardMutation(
                cardInfoHashBase64 = cardInfoHash.encodeBase64(),
                activationSecretBase64 = rawActivationSecret.encodeBase64(),
            )
            val response = post(client, mutation)

            assertEquals(200, response.code)

            val activationResult = response.toDataObject<CardActivationResultModel>()

            assertEquals(ActivationState.SUCCESS, activationResult.activationState)
            assertNotNull(activationResult.totpSecret)

            transaction {
                val card = CardEntity.findById(cardId) ?: throw AssertionError("Card not found")

                assertNotNull(card.firstActivationDate)
                assertEquals(activationResult.totpSecret, card.totpSecret?.encodeBase64())
            }
        }

    @Test
    fun `should return failed state when the card is static`() =
        JavalinTest.test(app) { _, client ->
            val cardInfoHash = SampleCards.BavarianStandard.hash()

            val cardId = TestData.createStaticCard(cardInfoHash, issuerId = eakRegionAdmin.id)

            val mutation = activateCardMutation(
                cardInfoHashBase64 = cardInfoHash.encodeBase64(),
                activationSecretBase64 = Random.nextBytes(20).encodeBase64(),
            )
            val response = post(client, mutation)

            assertEquals(200, response.code)

            val activationResult = response.toDataObject<CardActivationResultModel>()

            assertEquals(ActivationState.FAILED, activationResult.activationState)
            assertNull(activationResult.totpSecret)

            transaction {
                val card = CardEntity.findById(cardId) ?: throw AssertionError("Card not found")

                assertNull(card.firstActivationDate)
                assertNull(card.totpSecret)
            }
        }

    @Test
    fun `should return failed state when the card not found`() =
        JavalinTest.test(app) { _, client ->
            val mutation = activateCardMutation(
                cardInfoHashBase64 = Random.nextBytes(20).encodeBase64(),
                activationSecretBase64 = Random.nextBytes(20).encodeBase64(),
            )
            val response = post(client, mutation)

            assertEquals(200, response.code)

            val activationResult = response.toDataObject<CardActivationResultModel>()

            assertEquals(ActivationState.FAILED, activationResult.activationState)
            assertNull(activationResult.totpSecret)
        }

    @Test
    fun `should return failed state when the activation secret is incorrect`() =
        JavalinTest.test(app) { _, client ->
            val cardInfoHash = SampleCards.BavarianStandard.hash()

            val rawActivationSecret = Random.nextBytes(20)
            val activationSecretHash = CardActivator.hashActivationSecret(rawActivationSecret)

            val cardId = TestData.createDynamicCard(
                cardInfoHash,
                activationSecretHash,
                issuerId = eakRegionAdmin.id,
            )

            val mutation = activateCardMutation(
                cardInfoHashBase64 = cardInfoHash.encodeBase64(),
                activationSecretBase64 = Random.nextBytes(20).encodeBase64(),
            )
            val response = post(client, mutation)

            assertEquals(200, response.code)

            val activationResult = response.toDataObject<CardActivationResultModel>()

            assertEquals(ActivationState.FAILED, activationResult.activationState)
            assertNull(activationResult.totpSecret)

            transaction {
                val card = CardEntity.findById(cardId) ?: throw AssertionError("Card not found")

                assertNull(card.firstActivationDate)
                assertNull(card.totpSecret)
            }
        }

    @Test
    fun `should return failed state when the card is expired`() =
        JavalinTest.test(app) { _, client ->
            val cardInfoHash = SampleCards.BavarianStandard.hash()

            val rawActivationSecret = Random.nextBytes(20)
            val activationSecretHash = CardActivator.hashActivationSecret(rawActivationSecret)

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
            val response = post(client, mutation)

            assertEquals(200, response.code)

            val activationResult = response.toDataObject<CardActivationResultModel>()

            assertEquals(ActivationState.FAILED, activationResult.activationState)
            assertNull(activationResult.totpSecret)

            transaction {
                val card = CardEntity.findById(cardId) ?: throw AssertionError("Card not found")

                assertNull(card.firstActivationDate)
                assertNull(card.totpSecret)
            }
        }

    @Test
    fun `should return failed state when the card is revoked`() =
        JavalinTest.test(app) { _, client ->
            val cardInfoHash = SampleCards.BavarianStandard.hash()

            val rawActivationSecret = Random.nextBytes(20)
            val activationSecretHash = CardActivator.hashActivationSecret(rawActivationSecret)

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
            val response = post(client, mutation)

            assertEquals(200, response.code)

            val activationResult = response.toDataObject<CardActivationResultModel>()

            assertEquals(ActivationState.REVOKED, activationResult.activationState)
            assertNull(activationResult.totpSecret)

            transaction {
                val card = CardEntity.findById(cardId) ?: throw AssertionError("Card not found")

                assertNull(card.firstActivationDate)
                assertNull(card.totpSecret)
            }
        }

    @Test
    fun `should return successful activation result when the card has already been activated and overwrite = true`() =
        JavalinTest.test(app) { _, client ->
            val cardInfoHash = SampleCards.BavarianStandard.hash()

            val rawActivationSecret = Random.nextBytes(20)
            val activationSecretHash = CardActivator.hashActivationSecret(rawActivationSecret)

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
            val response = post(client, mutation)

            assertEquals(200, response.code)

            val activationResult = response.toDataObject<CardActivationResultModel>()

            assertEquals(ActivationState.SUCCESS, activationResult.activationState)
            assertNotNull(activationResult.totpSecret)

            transaction {
                val card = CardEntity.findById(cardId) ?: throw AssertionError("Card not found")

                // first activation date should not change
                assertEquals(firstActivationDate, card.firstActivationDate)
                // new totp secret should be generated
                assertEquals(activationResult.totpSecret, card.totpSecret?.encodeBase64())
            }
        }

    @Test
    fun `should return did_not_overwrite_existing state if card has already been activated and overwrite = false`() =
        JavalinTest.test(app) { _, client ->
            val cardInfoHash = SampleCards.BavarianStandard.hash()

            val rawActivationSecret = Random.nextBytes(20)
            val activationSecretHash = CardActivator.hashActivationSecret(rawActivationSecret)

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
            val response = post(client, mutation)

            assertEquals(200, response.code)

            val activationResult = response.toDataObject<CardActivationResultModel>()

            assertEquals(ActivationState.DID_NOT_OVERWRITE_EXISTING, activationResult.activationState)
            assertNull(activationResult.totpSecret)

            transaction {
                val card = CardEntity.findById(cardId) ?: throw AssertionError("Card not found")

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
