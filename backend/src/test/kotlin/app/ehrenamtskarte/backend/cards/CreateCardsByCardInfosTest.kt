package app.ehrenamtskarte.backend.cards

import app.ehrenamtskarte.backend.GraphqlApiTest
import app.ehrenamtskarte.backend.cards.database.CardEntity
import app.ehrenamtskarte.backend.cards.database.Cards
import app.ehrenamtskarte.backend.cards.database.CodeType
import app.ehrenamtskarte.backend.generated.CreateCardsByCardInfos
import app.ehrenamtskarte.backend.helper.SampleCards
import app.ehrenamtskarte.backend.helper.SampleCards.getEncoded
import app.ehrenamtskarte.backend.helper.TestAdministrators
import io.javalin.testtools.JavalinTest
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNotNull
import kotlin.test.assertNull

internal class CreateCardsByCardInfosTest : GraphqlApiTest() {
    private val projectAdmin = TestAdministrators.EAK_PROJECT_ADMIN
    private val regionAdmin = TestAdministrators.EAK_REGION_ADMIN

    @BeforeEach
    fun cleanUp() {
        transaction {
            Cards.deleteAll()
        }
    }

    @Test
    fun `POST returns an error when project does not exist`() =
        JavalinTest.test(app) { _, client ->
            val mutation = createMutation(
                project = "non-existent.ehrenamtskarte.app",
                encodedCardInfo = "dummy",
            )
            val response = post(client, mutation)

            assertEquals(404, response.code)
        }

    @Test
    fun `POST returns an error when the auth token is missing`() =
        JavalinTest.test(app) { _, client ->
            val mutation = createMutation(encodedCardInfo = "dummy")
            val response = post(client, mutation)

            assertEquals(401, response.code)
        }

    @Test
    fun `POST returns an error when the user is not allowed to create cards`() =
        JavalinTest.test(app) { _, client ->
            val encodedCardInfo = SampleCards.BavarianStandard.getEncoded()
            val mutation = createMutation(encodedCardInfo = encodedCardInfo)
            val response = post(client, mutation, projectAdmin.getJwtToken())

            assertEquals(403, response.code)
        }

    @Test
    fun `POST returns an error when encoded card info can't be parsed`() =
        JavalinTest.test(app) { _, client ->
            val mutation = createMutation(encodedCardInfo = "dummy")
            val response = post(client, mutation, regionAdmin.getJwtToken())

            assertEquals(200, response.code)

            val jsonResponse = response.json()

            jsonResponse.apply {
                assertEquals("Error INVALID_INPUT occurred.", findValuesAsText("message").single())
                assertEquals("Failed to parse encodedCardInfo", findValuesAsText("reason").single())
            }
        }

    @Test
    fun `POST returns a successful response when static and dynamic cards are created without an application`() =
        JavalinTest.test(app) { _, client ->
            val encodedCardInfo = SampleCards.BavarianStandard.getEncoded()
            val mutation = createMutation(encodedCardInfo = encodedCardInfo)
            val response = post(client, mutation, regionAdmin.getJwtToken())

            assertEquals(200, response.code)

            val jsonResponse = response.json()

            jsonResponse.apply {
                assertNotNull(findValue("dynamicActivationCode"))
                assertNotNull(findValue("staticVerificationCode"))
            }

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
        project: String = "bayern.ehrenamtskarte.app",
        encodedCardInfo: String,
        generateStaticCode: Boolean = true,
        applicationIdToMarkAsProcessed: Int? = null,
    ): CreateCardsByCardInfos {
        val variables = CreateCardsByCardInfos.Variables(
            project = project,
            encodedCardInfos = listOf(encodedCardInfo),
            generateStaticCodes = generateStaticCode,
            applicationIdToMarkAsProcessed = applicationIdToMarkAsProcessed,
        )
        return CreateCardsByCardInfos(variables)
    }
}
