package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.IntegrationTest
import app.ehrenamtskarte.backend.db.entities.ApiTokenType
import app.ehrenamtskarte.backend.db.entities.ApiTokens
import app.ehrenamtskarte.backend.db.entities.ApplicationVerifications
import app.ehrenamtskarte.backend.db.entities.Applications
import app.ehrenamtskarte.backend.db.entities.AvailableCardFormats
import app.ehrenamtskarte.backend.db.entities.RegionEntity
import app.ehrenamtskarte.backend.generated.AddEakApplication
import app.ehrenamtskarte.backend.generated.inputs.ApplicationInput
import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.TestApplicationBuilder
import app.ehrenamtskarte.backend.helper.TestData
import app.ehrenamtskarte.backend.helper.toDataObject
import app.ehrenamtskarte.backend.helper.toErrorObject
import app.ehrenamtskarte.backend.shared.mail.Mailer
import org.jetbrains.exposed.v1.jdbc.deleteAll
import org.jetbrains.exposed.v1.jdbc.selectAll
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import org.springframework.test.context.bean.override.mockito.MockitoBean
import kotlin.test.assertEquals

internal class AvailableCardFormatsApplicationTest : IntegrationTest() {
    @MockitoBean
    private lateinit var mailer: Mailer

    private val regionId = 1

    @BeforeEach
    fun cleanUp() {
        transaction {
            ApplicationVerifications.deleteAll()
            Applications.deleteAll()
            ApiTokens.deleteAll()
        }
    }

    @AfterEach
    fun resetAvailableCardFormats() {
        setAvailableCardFormats(AvailableCardFormats.DIGITAL_AND_PHYSICAL)
    }

    @Test
    fun `should create an application with a physical card if the region offers physical cards`() {
        setAvailableCardFormats(AvailableCardFormats.DIGITAL_AND_PHYSICAL)

        val mutation = createMutation(TestApplicationBuilder.build(isAlreadyVerified = false, wantsPhysicalCard = true))
        val response = postGraphQL(mutation)

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(true, response.toDataObject<Boolean>())
        transaction { assertEquals(1, Applications.selectAll().count()) }
    }

    @Test
    fun `should return an error if a physical card is requested but the region only offers digital cards`() {
        setAvailableCardFormats(AvailableCardFormats.DIGITAL)

        val mutation = createMutation(TestApplicationBuilder.build(isAlreadyVerified = false, wantsPhysicalCard = true))
        val response = postGraphQL(mutation)

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(
            GraphQLExceptionCode.PHYSICAL_CARD_NOT_AVAILABLE_IN_REGION,
            response.toErrorObject().extensions.code,
        )
        transaction { assertEquals(0, Applications.selectAll().count()) }
    }

    @Test
    fun `should create an application with only a digital card if the region only offers digital cards`() {
        setAvailableCardFormats(AvailableCardFormats.DIGITAL)

        val mutation = createMutation(TestApplicationBuilder.default())
        val response = postGraphQL(mutation)

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(true, response.toDataObject<Boolean>())
        transaction { assertEquals(1, Applications.selectAll().count()) }
    }

    @Test
    fun `should create a Verein360 application if the region only offers digital cards`() {
        setAvailableCardFormats(AvailableCardFormats.DIGITAL)
        TestData.createApiToken(
            creatorId = TestAdministrators.BAYERN_VEREIN_360.id,
            type = ApiTokenType.VERIFIED_APPLICATION,
        )

        val mutation = createMutation(TestApplicationBuilder.defaultVerified())
        val response = postGraphQL(mutation, token = "dummy")

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(true, response.toDataObject<Boolean>())
        transaction { assertEquals(1, Applications.selectAll().count()) }
    }

    private fun setAvailableCardFormats(availableCardFormats: AvailableCardFormats) {
        transaction {
            RegionEntity[regionId].availableCardFormats = availableCardFormats
        }
    }

    private fun createMutation(application: ApplicationInput): AddEakApplication =
        AddEakApplication(
            AddEakApplication.Variables(
                application = application,
                regionId = regionId,
                project = "bayern.ehrenamtskarte.app",
            ),
        )
}
