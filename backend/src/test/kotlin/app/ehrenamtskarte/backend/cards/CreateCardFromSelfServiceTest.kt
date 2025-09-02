package app.ehrenamtskarte.backend.cards

import app.ehrenamtskarte.backend.GraphqlApiTest
import app.ehrenamtskarte.backend.db.entities.CardEntity
import app.ehrenamtskarte.backend.db.entities.Cards
import app.ehrenamtskarte.backend.generated.CreateCardFromSelfService
import app.ehrenamtskarte.backend.helper.SampleCards
import app.ehrenamtskarte.backend.helper.SampleCards.getEncoded
import app.ehrenamtskarte.backend.helper.TestData
import app.ehrenamtskarte.backend.db.entities.UserEntitlements
import app.ehrenamtskarte.backend.db.entities.UserEntitlementsEntity
import io.javalin.testtools.JavalinTest
import io.ktor.util.decodeBase64Bytes
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.time.LocalDate
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import kotlin.test.assertTrue

internal class CreateCardFromSelfServiceTest : GraphqlApiTest() {
    @BeforeEach
    fun cleanUp() {
        transaction {
            Cards.deleteAll()
            UserEntitlements.deleteAll()
        }
    }

    @Test
    fun `POST returns an error when project does not exist`() =
        JavalinTest.test(app) { _, client ->
            val mutation = createMutation(
                project = "non-existent.sozialpass.app",
                encodedCardInfo = "qwerty",
            )
            val response = post(client, mutation)

            assertEquals(404, response.code)
        }

    @Test
    fun `POST returns an error when self-service is not enabled in the project`() =
        JavalinTest.test(app) { _, client ->
            val mutation = createMutation(
                project = "bayern.ehrenamtskarte.app",
                encodedCardInfo = "qwerty",
            )
            val response = post(client, mutation)

            assertEquals(404, response.code)
        }

    @Test
    fun `POST returns an error when encoded card info can't be parsed`() =
        JavalinTest.test(app) { _, client ->
            val mutation = createMutation(encodedCardInfo = "qwerty")
            val response = post(client, mutation)

            assertEquals(200, response.code)

            val jsonResponse = response.json()

            jsonResponse.apply {
                assertEquals("Error INVALID_INPUT occurred.", findValuesAsText("message").single())
                assertEquals("Failed to parse encodedCardInfo", findValuesAsText("reason").single())
            }

            transaction {
                assertEquals(0, Cards.selectAll().count())
            }
        }

    @Test
    fun `POST returns an error when user entitlements not found in the db`() =
        JavalinTest.test(app) { _, client ->
            val encodedCardInfo = SampleCards.koblenzPass().getEncoded()
            val mutation = createMutation(encodedCardInfo = encodedCardInfo)
            val response = post(client, mutation)

            assertEquals(200, response.code)

            val jsonResponse = response.json()

            jsonResponse.apply {
                assertEquals("Error USER_ENTITLEMENT_NOT_FOUND occurred.", findValuesAsText("message").single())
            }

            transaction {
                assertEquals(0, Cards.selectAll().count())
            }
        }

    @Test
    fun `POST returns an error when user entitlements expired`() =
        JavalinTest.test(app) { _, client ->
            TestData.createUserEntitlement(
                userHash = "\$argon2id\$v=19\$m=19456,t=2,p=1\$cr3lP9IMUKNz4BLfPGlAOHq1z98G5/2tTbhDIko35tY",
                endDate = LocalDate.now().minusDays(1L),
                regionId = 95,
            )

            val encodedCardInfo = SampleCards.koblenzPass().getEncoded()
            val mutation = createMutation(encodedCardInfo = encodedCardInfo)
            val response = post(client, mutation)

            assertEquals(200, response.code)

            val jsonResponse = response.json()

            jsonResponse.apply {
                assertEquals("Error USER_ENTITLEMENT_EXPIRED occurred.", findValuesAsText("message").single())
            }

            transaction {
                assertEquals(0, Cards.selectAll().count())
            }
        }

    @Test
    fun `POST returns an error when user entitlements revoked`() =
        JavalinTest.test(app) { _, client ->
            TestData.createUserEntitlement(
                userHash = "\$argon2id\$v=19\$m=19456,t=2,p=1\$cr3lP9IMUKNz4BLfPGlAOHq1z98G5/2tTbhDIko35tY",
                revoked = true,
                regionId = 95,
            )

            val encodedCardInfo = SampleCards.koblenzPass().getEncoded()
            val mutation = createMutation(encodedCardInfo = encodedCardInfo)
            val response = post(client, mutation)

            assertEquals(200, response.code)

            val jsonResponse = response.json()

            jsonResponse.apply {
                assertEquals("Error USER_ENTITLEMENT_EXPIRED occurred.", findPath("message").textValue())
            }

            transaction {
                assertEquals(0, Cards.selectAll().count())
            }
        }

    @Test
    fun `POST returns a successful response when cards are created`() =
        JavalinTest.test(app) { _, client ->
            val userRegionId = 95
            val userEntitlementId = TestData.createUserEntitlement(
                userHash = "\$argon2id\$v=19\$m=19456,t=2,p=1\$cr3lP9IMUKNz4BLfPGlAOHq1z98G5/2tTbhDIko35tY",
                regionId = userRegionId,
            )
            val oldDynamicCardId = TestData.createDynamicCard(entitlementId = userEntitlementId)
            val oldStaticCardId = TestData.createStaticCard(entitlementId = userEntitlementId)

            val encodedCardInfo = SampleCards.koblenzPass().getEncoded()
            val mutation = createMutation(encodedCardInfo = encodedCardInfo)
            val response = post(client, mutation)

            assertEquals(200, response.code)

            val jsonResponse = response.json()

            val newDynamicActivationCode = jsonResponse.findPath(
                "dynamicActivationCode",
            ).path("cardInfoHashBase64").textValue()
            val newStaticVerificationCode = jsonResponse.findPath(
                "staticVerificationCode",
            ).path("cardInfoHashBase64").textValue()

            assertNotNull(newDynamicActivationCode)
            assertNotNull(newStaticVerificationCode)

            transaction {
                assertEquals(4, Cards.selectAll().count())

                assertTrue(CardEntity.find { Cards.id eq oldDynamicCardId }.single().revoked)
                assertTrue(CardEntity.find { Cards.id eq oldStaticCardId }.single().revoked)

                val userEntitlement = UserEntitlementsEntity.find { UserEntitlements.id eq userEntitlementId }.single()

                CardEntity.find { Cards.cardInfoHash eq newDynamicActivationCode.decodeBase64Bytes() }.single().let {
                    assertNotNull(it.activationSecretHash)
                    assertNull(it.totpSecret)
                    assertEquals(userEntitlement.endDate.toEpochDay(), it.expirationDay)
                    assertFalse(it.revoked)
                    assertEquals(userRegionId, it.regionId.value)
                    assertNull(it.issuerId)
                    assertNull(it.firstActivationDate)
                    assertEquals(userEntitlement.startDate.toEpochDay(), it.startDay)
                    assertEquals(userEntitlement.id, it.entitlementId)
                }

                CardEntity.find { Cards.cardInfoHash eq newStaticVerificationCode.decodeBase64Bytes() }.single().let {
                    assertNull(it.activationSecretHash)
                    assertNull(it.totpSecret)
                    assertEquals(userEntitlement.endDate.toEpochDay(), it.expirationDay)
                    assertFalse(it.revoked)
                    assertEquals(userRegionId, it.regionId.value)
                    assertNull(it.issuerId)
                    assertNull(it.firstActivationDate)
                    assertEquals(userEntitlement.startDate.toEpochDay(), it.startDay)
                    assertEquals(userEntitlement.id, it.entitlementId)
                }
            }
        }

    private fun createMutation(
        project: String = "koblenz.sozialpass.app",
        encodedCardInfo: String,
        generateStaticCode: Boolean = true,
    ): CreateCardFromSelfService {
        val variables = CreateCardFromSelfService.Variables(
            project = project,
            encodedCardInfo = encodedCardInfo,
            generateStaticCode = generateStaticCode,
        )
        return CreateCardFromSelfService(variables)
    }
}
