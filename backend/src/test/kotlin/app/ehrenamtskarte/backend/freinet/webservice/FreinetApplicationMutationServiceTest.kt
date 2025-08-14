package app.ehrenamtskarte.backend.freinet.webservice

import app.ehrenamtskarte.backend.GraphqlApiTest
import app.ehrenamtskarte.backend.application.database.Applications
import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import app.ehrenamtskarte.backend.common.webservice.EAK_BAYERN_PROJECT
import app.ehrenamtskarte.backend.freinet.database.FreinetAgencies
import app.ehrenamtskarte.backend.freinet.database.FreinetAgenciesEntity
import app.ehrenamtskarte.backend.freinet.util.FreinetApi
import app.ehrenamtskarte.backend.freinet.webservice.schema.types.FreinetPersonCreationResultModel
import app.ehrenamtskarte.backend.generated.SendApplicationAndCardDataToFreinet
import app.ehrenamtskarte.backend.generated.inputs.FreinetCardInput
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.TestApplicationBuilder
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.javalin.testtools.JavalinTest
import io.mockk.every
import io.mockk.mockkConstructor
import io.mockk.verify
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals

internal class FreinetApplicationMutationServiceTest : GraphqlApiTest() {
    private val projectId = EAK_BAYERN_PROJECT
    private val regionAdminFreinet = TestAdministrators.EAK_REGION_ADMIN_FREINET
    private val projectAdmin = TestAdministrators.EAK_PROJECT_ADMIN
    private val objectMapper = jacksonObjectMapper()

    @BeforeEach
    fun cleanUp() {
        transaction {
            Applications.deleteAll()
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
    fun `POST returns an unauthorized error when not logged in`() =
        JavalinTest.test(app) { _, client ->
            val applicationId = createTestApplication()
            val mutation = createMutation(applicationId, projectId)
            val response = post(client, mutation)
            assertEquals(401, response.code)
        }

    @Test
    fun `POST returns not implemented error if freinet is not configured`() =
        JavalinTest.test(app) { _, client ->
            val applicationId = createTestApplication(regionId = 96)
            val mutation = createMutation(applicationId, "koblenz.sozialpass.app")
            val response = post(client, mutation, TestAdministrators.KOBLENZ_REGION_ADMIN.getJwtToken())
            assertEquals(501, response.code)
        }

    @Test
    fun `POST returns a forbidden error when requesting role is not authorized`() =
        JavalinTest.test(app) { _, client ->
            val applicationId = createTestApplication()
            val mutation = createMutation(applicationId, projectId)
            val response = post(client, mutation, projectAdmin.getJwtToken())
            assertEquals(401, response.code)
        }

    @Test
    fun `POST returns false when data transfer is not activated`() =
        JavalinTest.test(app) { _, client ->
            transaction {
                val agency = FreinetAgenciesEntity.find { FreinetAgencies.regionId eq 9 }.single()
                agency.dataTransferActivated = false
            }

            val applicationId = createTestApplicationForFreinet()
            val mutation = createMutation(applicationId, projectId)
            val response = post(client, mutation, regionAdminFreinet.getJwtToken())
            assertEquals(200, response.code)

            val jsonResponse = response.json()
            assertEquals(false, jsonResponse.path("data").path("sendApplicationAndCardDataToFreinet").asBoolean())
        }

    @Test
    fun `POST returns true when data transfer is activated and creates new person`() =
        JavalinTest.test(app) { _, client ->
            transaction {
                val agency = FreinetAgenciesEntity.find { FreinetAgencies.regionId eq 9 }.single()
                agency.dataTransferActivated = true
            }

            val applicationId = createTestApplicationForFreinet()
            val mutation = createMutation(applicationId, projectId)
            val response = post(client, mutation, regionAdminFreinet.getJwtToken())
            assertEquals(200, response.code)

            val jsonResponse = response.json()

            verify { anyConstructed<FreinetApi>().searchPersons("John", "Doe", "1990-01-01") }
            verify { anyConstructed<FreinetApi>().createPerson("John", "Doe", "1990-01-01", any(), any()) }
            verify { anyConstructed<FreinetApi>().sendCardInformation(12345, any()) }

            assertEquals(true, jsonResponse.path("data").path("sendApplicationAndCardDataToFreinet").asBoolean())
        }

    @Test
    fun `POST returns true when person exists and updates them`() =
        JavalinTest.test(app) { _, client ->
            transaction {
                val agency = FreinetAgenciesEntity.find { FreinetAgencies.regionId eq 9 }.single()
                agency.dataTransferActivated = true
            }

            every { anyConstructed<FreinetApi>().searchPersons(any(), any(), any()) } returns
                objectMapper.createArrayNode().apply {
                    add(
                        objectMapper.createObjectNode().apply {
                            put("id", 1277076)
                            put("name", "John")
                            put("nachname", "Doe")
                            put("strasse", "Example Street 123")
                            put("email", "john.doe@example.com")
                            put("geburtstag", "1990-01-01")
                        },
                    )
                }

            val applicationId = createTestApplicationForFreinet()
            val mutation = createMutation(applicationId, projectId)
            val response = post(client, mutation, regionAdminFreinet.getJwtToken())
            assertEquals(200, response.code)

            val jsonResponse = response.json()
            assertEquals(true, jsonResponse.path("data").path("sendApplicationAndCardDataToFreinet").asBoolean())
        }

    @Test
    fun `POST returns error when multiple persons are found in Freinet`() =
        JavalinTest.test(app) { _, client ->
            transaction {
                val agency = FreinetAgenciesEntity.find { FreinetAgencies.regionId eq 9 }.single()
                agency.dataTransferActivated = true
            }

            every { anyConstructed<FreinetApi>().searchPersons(any(), any(), any()) } returns
                objectMapper.createArrayNode().apply {
                    add(
                        objectMapper.createObjectNode().apply {
                            put("id", 1001)
                            put("name", "John")
                            put("nachname", "Doe")
                            put("geburtstag", "1990-01-01")
                        },
                    )
                    add(
                        objectMapper.createObjectNode().apply {
                            put("id", 1002)
                            put("name", "John")
                            put("nachname", "Doe")
                            put("geburtstag", "1990-01-01")
                        },
                    )
                }

            val applicationId = createTestApplicationForFreinet()
            val mutation = createMutation(applicationId, projectId)
            val response = post(client, mutation, regionAdminFreinet.getJwtToken())
            assertEquals(200, response.code)

            val jsonResponse = response.json()
            assertEquals(
                "Error FREINET_FOUND_MULTIPLE_PERSONS occurred.",
                jsonResponse.findValue("message").textValue(),
            )
        }

    private fun createTestApplication(regionId: Int = 9): Int =
        transaction {
            val applicationInput = TestApplicationBuilder.default()
            val wrappedApplication = mapOf("application" to applicationInput)
            val applicationJson = objectMapper.writeValueAsString(wrappedApplication)
            Applications.insert {
                it[Applications.regionId] = regionId
                it[Applications.jsonValue] = applicationJson
                it[Applications.accessKey] = "dummyKey"
            }[Applications.id].value
        }

    private fun createTestApplicationForFreinet(regionId: Int = 9): Int =
        transaction {
            val applicationJsonField = createTestApplicationJsonField()
            val applicationJson = objectMapper.writeValueAsString(applicationJsonField)

            Applications.insert {
                it[Applications.regionId] = regionId
                it[Applications.jsonValue] = applicationJson
                it[Applications.accessKey] = "dummyKey"
            }[Applications.id].value
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

    private fun createMutation(applicationId: Int, project: String): SendApplicationAndCardDataToFreinet {
        val freinetCard = FreinetCardInput(
            cardType = "Standard",
            expirationDate = "2026-12-31",
        )
        val variables = SendApplicationAndCardDataToFreinet.Variables(
            applicationId = applicationId,
            project = project,
            freinetCard = freinetCard,
        )
        return SendApplicationAndCardDataToFreinet(variables)
    }
}
