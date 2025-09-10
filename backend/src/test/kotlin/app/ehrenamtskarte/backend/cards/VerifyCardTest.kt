package app.ehrenamtskarte.backend.cards

import app.ehrenamtskarte.backend.GraphqlApiTest
import app.ehrenamtskarte.backend.db.entities.CardEntity
import app.ehrenamtskarte.backend.db.entities.Cards
import app.ehrenamtskarte.backend.graphql.cards.types.CardVerificationResultModel
import app.ehrenamtskarte.backend.generated.VerifyCardInProjectV2
import app.ehrenamtskarte.backend.generated.enums.CodeType
import app.ehrenamtskarte.backend.generated.inputs.CardVerificationModelInput
import app.ehrenamtskarte.backend.helper.TestData
import app.ehrenamtskarte.backend.db.entities.UserEntitlements
import io.javalin.testtools.JavalinTest
import io.ktor.util.encodeBase64
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.MethodSource
import java.time.LocalDate
import kotlin.random.Random
import kotlin.test.assertEquals
import kotlin.test.assertFalse

internal class VerifyCardTest : GraphqlApiTest() {
    data class VerifyCardTestCase(val createCard: () -> Int, val valid: Boolean, val extendable: Boolean)

    companion object {
        @JvmStatic
        fun verifyCardTestCases(): List<VerifyCardTestCase> =
            listOf(
                VerifyCardTestCase(
                    createCard = ::staticValidCardWithoutExpirationDay,
                    valid = true,
                    extendable = false,
                ),
                VerifyCardTestCase(
                    createCard = ::staticExpiredExtendableCard,
                    valid = false,
                    extendable = true,
                ),
                VerifyCardTestCase(
                    createCard = ::staticFutureNonExtendableCard,
                    valid = false,
                    extendable = false,
                ),
                VerifyCardTestCase(
                    createCard = ::staticRevokedExtendableCard,
                    valid = false,
                    extendable = true,
                ),
                VerifyCardTestCase(
                    createCard = ::dynamicExtendableCardWithoutTotpSecret,
                    valid = false,
                    extendable = true,
                ),
            )

        private fun staticValidCardWithoutExpirationDay(): Int {
            val userId = TestData.createUserEntitlement()
            return TestData.createStaticCard(
                entitlementId = userId,
                expirationDay = null,
            )
        }

        private fun staticExpiredExtendableCard(): Int {
            val userId = TestData.createUserEntitlement(endDate = LocalDate.now().plusMonths(2L))
            return TestData.createStaticCard(
                entitlementId = userId,
                expirationDay = LocalDate.now().minusMonths(1L).toEpochDay(),
            )
        }

        private fun staticFutureNonExtendableCard(): Int {
            val userId = TestData.createUserEntitlement(endDate = LocalDate.now().plusMonths(1L))
            return TestData.createStaticCard(
                entitlementId = userId,
                startDay = LocalDate.now().plusMonths(1L).toEpochDay(),
                expirationDay = LocalDate.now().plusMonths(2L).toEpochDay(),
            )
        }

        private fun staticRevokedExtendableCard(): Int {
            val userId = TestData.createUserEntitlement(endDate = LocalDate.now().plusMonths(2L))
            return TestData.createStaticCard(
                entitlementId = userId,
                expirationDay = LocalDate.now().plusMonths(1L).toEpochDay(),
                revoked = true,
            )
        }

        private fun dynamicExtendableCardWithoutTotpSecret(): Int {
            val userId = TestData.createUserEntitlement(endDate = LocalDate.now().plusMonths(2L))
            return TestData.createDynamicCard(
                entitlementId = userId,
                expirationDay = LocalDate.now().plusMonths(1L).toEpochDay(),
                totpSecret = null,
            )
        }
    }

    @BeforeEach
    fun cleanUp() {
        transaction {
            Cards.deleteAll()
            UserEntitlements.deleteAll()
        }
    }

    @ParameterizedTest
    @MethodSource("verifyCardTestCases")
    fun `should return whether the card is valid and extendable`(testCase: VerifyCardTestCase) =
        JavalinTest.test(app) { _, client ->
            val card = transaction {
                CardEntity.findById(testCase.createCard())
                    ?: error("Test card has not been created")
            }
            val query = createQuery(
                cardInfoHash = card.cardInfoHash.encodeBase64(),
                codeType = CodeType.valueOf(card.codeType.name),
            )

            val response = post(client, query)

            assertEquals(200, response.code)

            val verificationResult = response.toDataObject<CardVerificationResultModel>()

            assertEquals(testCase.valid, verificationResult.valid)
            assertEquals(testCase.extendable, verificationResult.extendable)
        }

    @Test
    fun `should return valid = false and extendable = false when the card doesn't exist`() =
        JavalinTest.test(app) { _, client ->
            val query = createQuery(
                cardInfoHash = Random.nextBytes(20).encodeBase64(),
                codeType = CodeType.STATIC,
            )

            val response = post(client, query)

            assertEquals(200, response.code)

            val verificationResult = response.toDataObject<CardVerificationResultModel>()

            assertFalse(verificationResult.valid)
            assertFalse(verificationResult.extendable)
        }

    @Test
    fun `should return an error when project does not exist`() =
        JavalinTest.test(app) { _, client ->
            val query = createQuery(
                project = "non-existent.sozialpass.app",
                cardInfoHash = "qwerty",
                codeType = CodeType.STATIC,
            )
            val response = post(client, query)

            assertEquals(404, response.code)
        }

    private fun createQuery(
        project: String = "koblenz.sozialpass.app",
        cardInfoHash: String,
        codeType: CodeType,
        totp: Int? = null,
    ): VerifyCardInProjectV2 {
        val variables = VerifyCardInProjectV2.Variables(
            project = project,
            card = CardVerificationModelInput(cardInfoHash, codeType, totp),
        )
        return VerifyCardInProjectV2(variables)
    }
}
