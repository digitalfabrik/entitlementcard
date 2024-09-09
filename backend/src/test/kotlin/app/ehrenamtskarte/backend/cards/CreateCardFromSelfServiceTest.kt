package app.ehrenamtskarte.backend.cards

import app.ehrenamtskarte.backend.GraphqlApiTest
import app.ehrenamtskarte.backend.cards.database.CardEntity
import app.ehrenamtskarte.backend.cards.database.Cards
import app.ehrenamtskarte.backend.cards.database.CodeType
import app.ehrenamtskarte.backend.helper.CardInfoTestSample
import app.ehrenamtskarte.backend.helper.ExampleCardInfo
import app.ehrenamtskarte.backend.userdata.database.UserEntitlements
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.javalin.testtools.JavalinTest
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.After
import org.junit.Test
import java.time.LocalDate
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import kotlin.test.assertTrue
import kotlin.test.fail

internal class CreateCardFromSelfServiceTest : GraphqlApiTest() {

    @After
    fun cleanUp() {
        transaction {
            UserEntitlements.deleteAll()
            Cards.deleteAll()
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
        transaction {
            UserEntitlements.insert {
                it[userHash] = "\$argon2id\$v=19\$m=19456,t=2,p=1\$57YPIKvU/XE9h7/JA0tZFT2TzpwBQfYAW6K+ojXBh5w".toByteArray()
                it[startDate] = LocalDate.now().minusYears(1L)
                it[endDate] = LocalDate.now().minusDays(1L)
                it[revoked] = false
                it[regionId] = 95
            }
        }

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
        transaction {
            UserEntitlements.insert {
                it[userHash] = "\$argon2id\$v=19\$m=19456,t=2,p=1\$57YPIKvU/XE9h7/JA0tZFT2TzpwBQfYAW6K+ojXBh5w".toByteArray()
                it[startDate] = LocalDate.now().minusDays(1L)
                it[endDate] = LocalDate.now().plusYears(1L)
                it[revoked] = true
                it[regionId] = 95
            }
        }

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
    fun `POST returns a successful response when cards are created`() = JavalinTest.test(app) { _, client ->
        val cardStartDay = LocalDate.now().minusDays(1L)
        val cardExpirationDay = LocalDate.now().plusYears(1L)
        val userRegionId = 95

        transaction {
            UserEntitlements.insert {
                it[userHash] = "\$argon2id\$v=19\$m=19456,t=2,p=1\$57YPIKvU/XE9h7/JA0tZFT2TzpwBQfYAW6K+ojXBh5w".toByteArray()
                it[startDate] = cardStartDay
                it[endDate] = cardExpirationDay
                it[revoked] = false
                it[regionId] = userRegionId
            }
        }

        val encodedCardInfo = ExampleCardInfo.getEncoded(CardInfoTestSample.KoblenzPass)
        val mutation = createMutation(encodedCardInfo = encodedCardInfo)
        val response = post(client, mutation)

        assertEquals(200, response.code)

        val responseBody = response.body?.string() ?: fail("Response body is null")
        val jsonResponse = jacksonObjectMapper().readTree(responseBody)

        jsonResponse.apply {
            assertTrue(path("data").path("createCardFromSelfService").has("dynamicActivationCode"))
            assertTrue(path("data").path("createCardFromSelfService").has("staticVerificationCode"))
        }

        transaction {
            assertEquals(2, Cards.selectAll().count())

            val dynamicCard = CardEntity.find { Cards.codeType eq CodeType.DYNAMIC }.single()

            assertNotNull(dynamicCard.activationSecretHash)
            assertNull(dynamicCard.totpSecret)
            assertEquals(cardExpirationDay.toEpochDay(), dynamicCard.expirationDay)
            assertFalse(dynamicCard.revoked)
            assertEquals(userRegionId, dynamicCard.regionId.value)
            assertNull(dynamicCard.issuerId)
            assertNotNull(dynamicCard.cardInfoHash)
            assertNull(dynamicCard.firstActivationDate)
            assertEquals(cardStartDay.toEpochDay(), dynamicCard.startDay)

            val staticCard = CardEntity.find { Cards.codeType eq CodeType.STATIC }.single()

            assertNull(staticCard.activationSecretHash)
            assertNull(staticCard.totpSecret)
            assertEquals(cardExpirationDay.toEpochDay(), staticCard.expirationDay)
            assertFalse(staticCard.revoked)
            assertEquals(userRegionId, staticCard.regionId.value)
            assertNull(staticCard.issuerId)
            assertNotNull(staticCard.cardInfoHash)
            assertNull(staticCard.firstActivationDate)
            assertEquals(cardStartDay.toEpochDay(), staticCard.startDay)
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
