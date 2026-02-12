package app.ehrenamtskarte.backend.freinet.webservice

import app.ehrenamtskarte.backend.IntegrationTest
import app.ehrenamtskarte.backend.db.entities.Applications
import app.ehrenamtskarte.backend.db.entities.FreinetAgencies
import app.ehrenamtskarte.backend.db.entities.FreinetAgenciesEntity
import app.ehrenamtskarte.backend.generated.SendApplicationAndCardDataToFreinet
import app.ehrenamtskarte.backend.generated.inputs.FreinetCardInput
import app.ehrenamtskarte.backend.graphql.application.types.JsonField
import app.ehrenamtskarte.backend.graphql.application.types.Type
import app.ehrenamtskarte.backend.graphql.freinet.types.FreinetPersonCreationResultModel
import app.ehrenamtskarte.backend.graphql.freinet.util.FreinetApi
import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.TestData
import app.ehrenamtskarte.backend.helper.toDataObject
import app.ehrenamtskarte.backend.helper.toErrorObject
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.mockk.every
import io.mockk.mockkConstructor
import io.mockk.verify
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.jdbc.deleteAll
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import kotlin.test.assertEquals

internal class FreinetApplicationMutationServiceTest : IntegrationTest() {
    private val regionAdminFreinet = TestAdministrators.EAK_REGION_ADMIN_FREINET
    private val objectMapper = jacksonObjectMapper()

    @BeforeEach
    fun cleanUp() {
        transaction {
            Applications.deleteAll()
            // Reset the state for the region used in the tests
            val agency = FreinetAgenciesEntity.find { FreinetAgencies.regionId eq regionAdminFreinet.regionId }.single()
            agency.dataTransferActivated = false
        }
    }

    @BeforeEach
    fun mockFreinetApi() {
        mockkConstructor(FreinetApi::class)

        every { anyConstructed<FreinetApi>().searchPersons(any(), any(), any()) } returns objectMapper.createArrayNode()
        val defaultCreatePersonResult = objectMapper.createObjectNode().apply {
            put("NEW_USERID", 12345)
        }
        every { anyConstructed<FreinetApi>().createPerson(any(), any(), any(), any(), any()) } returns
            FreinetPersonCreationResultModel(true, defaultCreatePersonResult)
        every { anyConstructed<FreinetApi>().sendCardInformation(any(), any()) } returns Unit
    }

    @Test
    fun `should return an unauthorized error when not logged in`() {
        val applicationId = createTestApplication()
        val mutation = createMutation(applicationId)
        val response = postGraphQL(mutation)

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals(GraphQLExceptionCode.UNAUTHORIZED, error.extensions.code)

        verify(exactly = 0) { anyConstructed<FreinetApi>().searchPersons(any(), any(), any()) }
    }

    @Test
    fun `should return not implemented error if freinet is not configured`() {
        val applicationId = createTestApplication(regionId = 96)
        val mutation = createMutation(applicationId)
        val response = postGraphQL(mutation, TestAdministrators.KOBLENZ_REGION_ADMIN.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals(GraphQLExceptionCode.NOT_IMPLEMENTED, error.extensions.code)

        verify(exactly = 0) { anyConstructed<FreinetApi>().searchPersons(any(), any(), any()) }
    }

    @Test
    fun `should return a forbidden error when role is not authorized`() {
        val applicationId = createTestApplication()
        val mutation = createMutation(applicationId)
        val response = postGraphQL(mutation, TestAdministrators.EAK_PROJECT_ADMIN.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals(GraphQLExceptionCode.FORBIDDEN, error.extensions.code)

        verify(exactly = 0) { anyConstructed<FreinetApi>().searchPersons(any(), any(), any()) }
    }

    @Test
    fun `should return a forbidden error when region is not authorized`() {
        val applicationId = createTestApplication(regionId = 9)
        val mutation = createMutation(applicationId)
        val response = postGraphQL(mutation, regionAdminFreinet.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals(GraphQLExceptionCode.FORBIDDEN, error.extensions.code)

        verify(exactly = 0) { anyConstructed<FreinetApi>().searchPersons(any(), any(), any()) }
    }

    @Test
    fun `should return false when data transfer is not activated`() {
        // State is set to false in cleanUp() by default
        val applicationId = createTestApplication()
        val mutation = createMutation(applicationId)
        val response = postGraphQL(mutation, regionAdminFreinet.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(false, response.toDataObject())

        verify(exactly = 0) { anyConstructed<FreinetApi>().searchPersons(any(), any(), any()) }
    }

    @Test
    fun `should return true and create new person when data transfer is activated`() {
        transaction {
            val agency = FreinetAgenciesEntity.find { FreinetAgencies.regionId eq regionAdminFreinet.regionId }.single()
            agency.dataTransferActivated = true
        }

        val applicationId = createTestApplication()
        val mutation = createMutation(applicationId)
        val response = postGraphQL(mutation, regionAdminFreinet.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(true, response.toDataObject())

        verify { anyConstructed<FreinetApi>().searchPersons("John", "Doe", "1990-01-01") }
        verify { anyConstructed<FreinetApi>().createPerson("John", "Doe", "1990-01-01", any(), any()) }
        verify { anyConstructed<FreinetApi>().sendCardInformation(12345, any()) }
    }

    @Test
    fun `should return true when person already exists in Freinet`() {
        transaction {
            val agency = FreinetAgenciesEntity.find { FreinetAgencies.regionId eq regionAdminFreinet.regionId }.single()
            agency.dataTransferActivated = true
        }

        every { anyConstructed<FreinetApi>().searchPersons(any(), any(), any()) } returns
            objectMapper.createArrayNode().apply {
                add(
                    objectMapper.createObjectNode().apply {
                        put("id", 1277076)
                        put("name", "John")
                        put("nachname", "Doe")
                        put("geburtstag", "1990-01-01")
                    },
                )
            }

        val applicationId = createTestApplication()
        val mutation = createMutation(applicationId)
        val response = postGraphQL(mutation, regionAdminFreinet.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(true, response.toDataObject())

        verify { anyConstructed<FreinetApi>().searchPersons("John", "Doe", "1990-01-01") }
        verify(exactly = 0) { anyConstructed<FreinetApi>().createPerson(any(), any(), any(), any(), any()) }
        verify { anyConstructed<FreinetApi>().sendCardInformation(1277076, any()) }
    }

    @Test
    fun `should return an error when multiple persons are found in Freinet`() {
        transaction {
            val agency = FreinetAgenciesEntity.find { FreinetAgencies.regionId eq regionAdminFreinet.regionId }.single()
            agency.dataTransferActivated = true
        }

        every { anyConstructed<FreinetApi>().searchPersons(any(), any(), any()) } returns
            objectMapper.createArrayNode().apply {
                add(objectMapper.createObjectNode().put("id", 1001))
                add(objectMapper.createObjectNode().put("id", 1002))
            }

        val applicationId = createTestApplication()
        val mutation = createMutation(applicationId)
        val response = postGraphQL(mutation, regionAdminFreinet.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals("Error FREINET_FOUND_MULTIPLE_PERSONS occurred.", error.message)

        verify { anyConstructed<FreinetApi>().searchPersons("John", "Doe", "1990-01-01") }
        verify(exactly = 0) { anyConstructed<FreinetApi>().createPerson(any(), any(), any(), any(), any()) }
        verify(exactly = 0) { anyConstructed<FreinetApi>().sendCardInformation(any(), any()) }
    }

    private fun createTestApplication(regionId: Int = regionAdminFreinet.regionId!!): Int {
        val applicationJsonField = createTestApplicationJsonField()
        val applicationJson = objectMapper.writeValueAsString(applicationJsonField)

        return TestData.createApplication(
            regionId = regionId,
            jsonValue = applicationJson,
        )
    }

    private fun createTestApplicationJsonField(): JsonField {
        val addressFields = listOf(
            JsonField("street", Type.String, "Example Street"),
            JsonField("houseNumber", Type.String, "123"),
            JsonField("postalCode", Type.String, "80331"),
            JsonField("location", Type.String, "München"),
            JsonField("country", Type.String, "Deutschland"),
        )

        val personalDataFields = listOf(
            JsonField("forenames", Type.String, "John"),
            JsonField("surname", Type.String, "Doe"),
            JsonField("dateOfBirth", Type.Date, "1990-01-01"),
            JsonField("emailAddress", Type.String, "johndoe@example.com"),
            JsonField("telephone", Type.String, "123456789"),
            JsonField("address", Type.Array, addressFields),
        )

        val applicationDetailsFields = listOf(
            JsonField("applicationType", Type.String, "FIRST_APPLICATION"),
            JsonField("cardType", Type.String, "BLUE"),
            JsonField("givenInformationIsCorrectAndComplete", Type.Boolean, true),
            JsonField("hasAcceptedEmailUsage", Type.Boolean, true),
            JsonField("hasAcceptedPrivacyPolicy", Type.Boolean, true),
            JsonField("wantsDigitalCard", Type.Boolean, true),
            JsonField("wantsPhysicalCard", Type.Boolean, false),
        )

        val applicationFields = listOf(
            JsonField("personalData", Type.Array, personalDataFields),
            JsonField("applicationDetails", Type.Array, applicationDetailsFields),
        )

        return JsonField("application", Type.Array, applicationFields)
    }

    private fun createMutation(applicationId: Int): SendApplicationAndCardDataToFreinet {
        val freinetCard = FreinetCardInput(
            cardType = "Standard",
            expirationDate = "2026-12-31",
        )
        val variables = SendApplicationAndCardDataToFreinet.Variables(
            applicationId = applicationId,
            freinetCard = freinetCard,
        )
        return SendApplicationAndCardDataToFreinet(variables)
    }
}
