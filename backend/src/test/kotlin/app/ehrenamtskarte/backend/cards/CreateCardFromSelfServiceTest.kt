package app.ehrenamtskarte.backend.cards

import app.ehrenamtskarte.backend.GraphqlApiTest
import app.ehrenamtskarte.backend.cards.database.CardEntity
import app.ehrenamtskarte.backend.cards.database.Cards
import app.ehrenamtskarte.backend.helper.CardInfoTestSample
import app.ehrenamtskarte.backend.helper.ExampleCardInfo
import app.ehrenamtskarte.backend.helper.TestData
import app.ehrenamtskarte.backend.userdata.database.UserEntitlements
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.javalin.testtools.JavalinTest
import io.ktor.util.decodeBase64Bytes
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Test
import java.time.LocalDate
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import kotlin.test.assertTrue
import kotlin.test.fail

internal class CreateCardFromSelfServiceTest : GraphqlApiTest() {

    @AfterEach
    fun cleanUp() {
        transaction {
            Cards.deleteAll()
            UserEntitlements.deleteAll()
        }
    }

    @Test
    fun `POST returns an error when project does not exist`() = JavalinTest.test(app) { _, client ->
        val mutation = createMutation(
            project = "non-existent.sozialpass.app",
            encodedCardInfo = "qwerty"
        )
        val response = post(client, mutation)

        assertEquals(404, response.code)
    }

    @Test
    fun `POST returns an error when self-service is not enabled in the project`() = JavalinTest.test(app) { _, client ->
        val mutation = createMutation(
            project = "bayern.ehrenamtskarte.app",
            encodedCardInfo = "qwerty"
        )
        val response = post(client, mutation)

        assertEquals(404, response.code)
    }

    @Test
    fun `POST returns an error when encoded card info can't be parsed`() = JavalinTest.test(app) { _, client ->
        val mutation = createMutation(encodedCardInfo = "qwerty")
        val response = post(client, mutation)

        assertEquals(200, response.code)

        val responseBody = response.body?.string() ?: fail("Response body is null")
        val jsonResponse = jacksonObjectMapper().readTree(responseBody)

        jsonResponse.apply {
            assertEquals("Error INVALID_INPUT occurred.", findValuesAsText("message").single())
            assertEquals("Failed to parse encodedCardInfo", findValuesAsText("reason").single())
        }

        transaction {
            assertEquals(0, Cards.selectAll().count())
        }
    }

    @Test
    fun `POST returns an error when user entitlements not found in the db`() = JavalinTest.test(app) { _, client ->
        val encodedCardInfo = ExampleCardInfo.getEncoded(CardInfoTestSample.KoblenzPass)
        val mutation = createMutation(encodedCardInfo = encodedCardInfo)
        val response = post(client, mutation)

        assertEquals(200, response.code)

        val responseBody = response.body?.string() ?: fail("Response body is null")
        val jsonResponse = jacksonObjectMapper().readTree(responseBody)

        jsonResponse.apply {
            assertEquals("Error INVALID_USER_ENTITLEMENTS occurred.", findValuesAsText("message").single())
        }

        transaction {
            assertEquals(0, Cards.selectAll().count())
        }
    }

    @Test
    fun `POST returns an error when user entitlements expired`() = JavalinTest.test(app) { _, client ->
        TestData.createUserEntitlements(
            userHash = "\$argon2id\$v=19\$m=19456,t=2,p=1\$cr3lP9IMUKNz4BLfPGlAOHq1z98G5/2tTbhDIko35tY",
            endDate = LocalDate.now().minusDays(1L),
            regionId = 95
        )

        val encodedCardInfo = ExampleCardInfo.getEncoded(CardInfoTestSample.KoblenzPass)
        val mutation = createMutation(encodedCardInfo = encodedCardInfo)
        val response = post(client, mutation)

        assertEquals(200, response.code)

        val responseBody = response.body?.string() ?: fail("Response body is null")
        val jsonResponse = jacksonObjectMapper().readTree(responseBody)

        jsonResponse.apply {
            assertEquals("Error INVALID_USER_ENTITLEMENTS occurred.", findValuesAsText("message").single())
        }

        transaction {
            assertEquals(0, Cards.selectAll().count())
        }
    }

    @Test
    fun `POST returns an error when user entitlements revoked`() = JavalinTest.test(app) { _, client ->
        TestData.createUserEntitlements(
            userHash = "\$argon2id\$v=19\$m=19456,t=2,p=1\$cr3lP9IMUKNz4BLfPGlAOHq1z98G5/2tTbhDIko35tY",
            revoked = true,
            regionId = 95
        )

        val encodedCardInfo = ExampleCardInfo.getEncoded(CardInfoTestSample.KoblenzPass)
        val mutation = createMutation(encodedCardInfo = encodedCardInfo)
        val response = post(client, mutation)

        assertEquals(200, response.code)

        val responseBody = response.body?.string() ?: fail("Response body is null")
        val jsonResponse = jacksonObjectMapper().readTree(responseBody)

        jsonResponse.apply {
            assertEquals("Error INVALID_USER_ENTITLEMENTS occurred.", findPath("message").textValue())
        }

        transaction {
            assertEquals(0, Cards.selectAll().count())
        }
    }

    @Test
    fun `POST returns a successful response when cards are created`() = JavalinTest.test(app) { _, client ->
        val userRegionId = 95
        val userEntitlements = TestData.createUserEntitlements(
            userHash = "\$argon2id\$v=19\$m=19456,t=2,p=1\$cr3lP9IMUKNz4BLfPGlAOHq1z98G5/2tTbhDIko35tY",
            regionId = userRegionId
        )
        val oldDynamicCard = TestData.createDynamicCard(regionId = userRegionId, entitlementId = userEntitlements.id.value)
        val oldStaticCard = TestData.createStaticCard(regionId = userRegionId, entitlementId = userEntitlements.id.value)

        val encodedCardInfo = ExampleCardInfo.getEncoded(CardInfoTestSample.KoblenzPass)
        val mutation = createMutation(encodedCardInfo = encodedCardInfo)
        val response = post(client, mutation)

        assertEquals(200, response.code)

        val responseBody = response.body?.string() ?: fail("Response body is null")
        val jsonResponse = jacksonObjectMapper().readTree(responseBody)

        val newDynamicActivationCode = jsonResponse.findPath("dynamicActivationCode").path("cardInfoHashBase64").textValue()
        val newStaticVerificationCode = jsonResponse.findPath("staticVerificationCode").path("cardInfoHashBase64").textValue()

        assertNotNull(newDynamicActivationCode)
        assertNotNull(newStaticVerificationCode)

        transaction {
            assertEquals(4, Cards.selectAll().count())

            CardEntity.find { Cards.cardInfoHash eq oldDynamicCard.cardInfoHash }.single().let {
                assertTrue(it.revoked)
            }

            CardEntity.find { Cards.cardInfoHash eq oldStaticCard.cardInfoHash }.single().let {
                assertTrue(it.revoked)
            }

            CardEntity.find { Cards.cardInfoHash eq newDynamicActivationCode.decodeBase64Bytes() }.single().let {
                assertNotNull(it.activationSecretHash)
                assertNull(it.totpSecret)
                assertEquals(userEntitlements.endDate.toEpochDay(), it.expirationDay)
                assertFalse(it.revoked)
                assertEquals(userRegionId, it.regionId.value)
                assertNull(it.issuerId)
                assertNull(it.firstActivationDate)
                assertEquals(userEntitlements.startDate.toEpochDay(), it.startDay)
                assertEquals(userEntitlements.id, it.entitlementId)
            }

            CardEntity.find { Cards.cardInfoHash eq newStaticVerificationCode.decodeBase64Bytes() }.single().let {
                assertNull(it.activationSecretHash)
                assertNull(it.totpSecret)
                assertEquals(userEntitlements.endDate.toEpochDay(), it.expirationDay)
                assertFalse(it.revoked)
                assertEquals(userRegionId, it.regionId.value)
                assertNull(it.issuerId)
                assertNull(it.firstActivationDate)
                assertEquals(userEntitlements.startDate.toEpochDay(), it.startDay)
                assertEquals(userEntitlements.id, it.entitlementId)
            }
        }
    }

    private fun createMutation(project: String = "koblenz.sozialpass.app", encodedCardInfo: String, generateStaticCode: Boolean = true): String {
        return """
        mutation {
            createCardFromSelfService(
                project: "$project"
                encodedCardInfo: "$encodedCardInfo"
                generateStaticCode: $generateStaticCode
            ) {
                dynamicActivationCode {
                    cardInfoHashBase64
                    codeBase64
                }
                staticVerificationCode {
                    cardInfoHashBase64
                    codeBase64
                }
            }
        }
        """.trimIndent()
    }
}
