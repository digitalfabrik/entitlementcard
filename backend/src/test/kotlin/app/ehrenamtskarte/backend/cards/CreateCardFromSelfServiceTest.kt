package app.ehrenamtskarte.backend.cards

import app.ehrenamtskarte.backend.IntegrationTest
import app.ehrenamtskarte.backend.db.entities.CardEntity
import app.ehrenamtskarte.backend.db.entities.Cards
import app.ehrenamtskarte.backend.db.entities.UserEntitlements
import app.ehrenamtskarte.backend.db.entities.UserEntitlementsEntity
import app.ehrenamtskarte.backend.generated.CreateCardFromSelfService
import app.ehrenamtskarte.backend.generated.createcardfromselfservice.CardCreationResultModel
import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode
import app.ehrenamtskarte.backend.helper.SampleCards
import app.ehrenamtskarte.backend.helper.SampleCards.getEncoded
import app.ehrenamtskarte.backend.helper.TestData
import app.ehrenamtskarte.backend.helper.toDataObject
import app.ehrenamtskarte.backend.helper.toErrorObject
import io.ktor.util.decodeBase64Bytes
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import java.time.LocalDate
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import kotlin.test.assertTrue

internal class CreateCardFromSelfServiceTest : IntegrationTest() {
    @BeforeEach
    fun cleanUp() {
        transaction {
            Cards.deleteAll()
            UserEntitlements.deleteAll()
        }
    }

    @Test
    fun `should return an error when project does not exist`() {
        val mutation = createMutation(
            project = "non-existent.sozialpass.app",
            encodedCardInfo = "qwerty",
        )
        val response = postGraphQL(mutation)

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals("Project 'non-existent.sozialpass.app' not found", error.message)
        assertEquals("NOT_FOUND", error.extensions?.classification)
    }

    @Test
    fun `should return an error when self-service is not enabled in the project`() {
        val mutation = createMutation(
            project = "bayern.ehrenamtskarte.app",
            encodedCardInfo = "qwerty",
        )
        val response = postGraphQL(mutation)

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals("Resource not found", error.message)
        assertEquals("NOT_FOUND", error.extensions?.classification)
    }

    @Test
    fun `should return an error when encoded card info can't be parsed`() {
        val mutation = createMutation(encodedCardInfo = "qwerty")
        val response = postGraphQL(mutation)

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals("Failed to parse encodedCardInfo", error.message)
        assertEquals(GraphQLExceptionCode.INVALID_INPUT, error.extensions?.code)

        transaction {
            assertEquals(0, Cards.selectAll().count())
        }
    }

    @Test
    fun `should return an error when user entitlements not found in the db`() {
        val encodedCardInfo = SampleCards.koblenzPass().getEncoded()
        val mutation = createMutation(encodedCardInfo = encodedCardInfo)
        val response = postGraphQL(mutation)

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals("Error USER_ENTITLEMENT_NOT_FOUND occurred.", error.message)
        assertEquals(GraphQLExceptionCode.USER_ENTITLEMENT_NOT_FOUND, error.extensions?.code)

        transaction {
            assertEquals(0, Cards.selectAll().count())
        }
    }

    @Test
    fun `should return an error when user entitlements expired`() {
        TestData.createUserEntitlement(
            userHash = $$"$argon2id$v=19$m=19456,t=2,p=1$cr3lP9IMUKNz4BLfPGlAOHq1z98G5/2tTbhDIko35tY",
            endDate = LocalDate.now().minusDays(1L),
            regionId = 95,
        )

        val encodedCardInfo = SampleCards.koblenzPass().getEncoded()
        val mutation = createMutation(encodedCardInfo = encodedCardInfo)
        val response = postGraphQL(mutation)

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals("Error USER_ENTITLEMENT_EXPIRED occurred.", error.message)
        assertEquals(GraphQLExceptionCode.USER_ENTITLEMENT_EXPIRED, error.extensions?.code)

        transaction {
            assertEquals(0, Cards.selectAll().count())
        }
    }

    @Test
    fun `should return an error when user entitlements revoked`() {
        TestData.createUserEntitlement(
            userHash = $$"$argon2id$v=19$m=19456,t=2,p=1$cr3lP9IMUKNz4BLfPGlAOHq1z98G5/2tTbhDIko35tY",
            revoked = true,
            regionId = 95,
        )

        val encodedCardInfo = SampleCards.koblenzPass().getEncoded()
        val mutation = createMutation(encodedCardInfo = encodedCardInfo)
        val response = postGraphQL(mutation)

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals("Error USER_ENTITLEMENT_EXPIRED occurred.", error.message)
        assertEquals(GraphQLExceptionCode.USER_ENTITLEMENT_EXPIRED, error.extensions?.code)

        transaction {
            assertEquals(0, Cards.selectAll().count())
        }
    }

    @Test
    fun `should return a successful response when cards are created`() {
        val userRegionId = 95
        val userEntitlementId = TestData.createUserEntitlement(
            userHash = $$"$argon2id$v=19$m=19456,t=2,p=1$cr3lP9IMUKNz4BLfPGlAOHq1z98G5/2tTbhDIko35tY",
            regionId = userRegionId,
        )
        val oldDynamicCardId = TestData.createDynamicCard(entitlementId = userEntitlementId)
        val oldStaticCardId = TestData.createStaticCard(entitlementId = userEntitlementId)

        val encodedCardInfo = SampleCards.koblenzPass().getEncoded()
        val mutation = createMutation(encodedCardInfo = encodedCardInfo)
        val response = postGraphQL(mutation)

        assertEquals(HttpStatus.OK, response.statusCode)

        val result = response.toDataObject<CardCreationResultModel>()
        val newDynamicActivationCode = result.dynamicActivationCode
        val newStaticVerificationCode = result.staticVerificationCode

        assertNotNull(newDynamicActivationCode)
        assertNotNull(newStaticVerificationCode)
        assertNotNull(newDynamicActivationCode.cardInfoHashBase64)
        assertNotNull(newStaticVerificationCode.cardInfoHashBase64)

        transaction {
            assertEquals(4, Cards.selectAll().count())

            assertTrue(CardEntity.findById(oldDynamicCardId)!!.revoked)
            assertTrue(CardEntity.findById(oldStaticCardId)!!.revoked)

            val userEntitlement = UserEntitlementsEntity.findById(userEntitlementId)!!

            CardEntity.find { Cards.cardInfoHash eq newDynamicActivationCode.cardInfoHashBase64.decodeBase64Bytes() }
                .single().let {
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

            CardEntity.find { Cards.cardInfoHash eq newStaticVerificationCode.cardInfoHashBase64.decodeBase64Bytes() }
                .single().let {
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
