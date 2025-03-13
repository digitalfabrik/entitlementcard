package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.GraphqlApiTest
import app.ehrenamtskarte.backend.application.database.ApplicationEntity
import app.ehrenamtskarte.backend.application.database.ApplicationVerificationEntity
import app.ehrenamtskarte.backend.application.database.ApplicationVerificationExternalSource
import app.ehrenamtskarte.backend.application.database.ApplicationVerifications
import app.ehrenamtskarte.backend.application.database.Applications
import app.ehrenamtskarte.backend.auth.database.ApiTokenType
import app.ehrenamtskarte.backend.auth.database.ApiTokens
import app.ehrenamtskarte.backend.generated.AddEakApplication
import app.ehrenamtskarte.backend.generated.enums.ApplicationType
import app.ehrenamtskarte.backend.generated.inputs.ApplicationInput
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.TestApplicationBuilder
import app.ehrenamtskarte.backend.helper.TestData
import app.ehrenamtskarte.backend.util.GraphQLRequestSerializer
import io.javalin.testtools.JavalinTest
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.MethodSource
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull

internal class Verein360ApplicationTest : GraphqlApiTest() {

    data class ValidationErrorTestCase(val application: ApplicationInput, val error: String)

    companion object {
        @JvmStatic
        fun validationErrorTestCases(): List<ValidationErrorTestCase> {
            return listOf(
                ValidationErrorTestCase(
                    application = TestApplicationBuilder.build(
                        isAlreadyVerified = true,
                        applicationType = ApplicationType.RENEWAL_APPLICATION
                    ),
                    error = "Application type must be FIRST_APPLICATION if application is already verified"
                ),
                ValidationErrorTestCase(
                    application = TestApplicationBuilder.build(
                        isAlreadyVerified = true,
                        wantsDigitalCard = false,
                        wantsPhysicalCard = true
                    ),
                    error = "Digital card must be true if application is already verified"
                ),
                ValidationErrorTestCase(
                    application = TestApplicationBuilder.build(
                        isAlreadyVerified = true,
                        wantsPhysicalCard = true
                    ),
                    error = "Physical card must be false if application is already verified"
                ),
                ValidationErrorTestCase(
                    application = TestApplicationBuilder.build(
                        isAlreadyVerified = true,
                        category = "Other"
                    ),
                    error = "All organizations must be of category Sport if application is already verified"
                )
            )
        }
    }

    private val adminVerein360 = TestAdministrators.BAYERN_VEREIN_360

    @BeforeEach
    fun cleanUp() {
        transaction {
            ApplicationVerifications.deleteAll()
            Applications.deleteAll()
            ApiTokens.deleteAll()
        }
    }

    @ParameterizedTest
    @MethodSource("validationErrorTestCases")
    fun `should return validation error when the request is not valid`(testCase: ValidationErrorTestCase) = JavalinTest.test(app) { _, client ->
        TestData.createApiToken(creatorId = adminVerein360.id, type = ApiTokenType.VERIFIED_APPLICATION)

        val mutation = createMutation(application = testCase.application)
        val response = post(client, mutation, token = "dummy")

        assertEquals(200, response.code)

        val jsonResponse = response.json()

        assertEquals("Error INVALID_JSON occurred.", jsonResponse.findValue("message").textValue())
        assertEquals(testCase.error, jsonResponse.findValue("reason").textValue())
    }

    @Test
    fun `should return an error when region not found`() = JavalinTest.test(app) { _, client ->
        val mutation = createMutation(
            regionId = 99,
            application = TestApplicationBuilder.build(true)
        )
        val response = post(client, mutation)

        assertEquals(200, response.code)

        val jsonResponse = response.json()

        assertEquals("Error REGION_NOT_FOUND occurred.", jsonResponse.findValue("message").textValue())
    }

    @Test
    fun `should return an error when the application is pre-verified but auth token is missing`() = JavalinTest.test(app) { _, client ->
        val mutation = createMutation(
            application = TestApplicationBuilder.build(true)
        )
        val response = post(client, mutation)

        assertEquals(401, response.code)
    }

    @Test
    fun `should return an error when api token not found`() = JavalinTest.test(app) { _, client ->
        val mutation = createMutation(
            application = TestApplicationBuilder.build(true)
        )
        val response = post(client, mutation, token = "non-existent")

        assertEquals(403, response.code)
    }

    @Test
    fun `should return an error when api token has wrong type`() = JavalinTest.test(app) { _, client ->
        TestData.createApiToken(creatorId = adminVerein360.id, type = ApiTokenType.USER_IMPORT)

        val mutation = createMutation(
            application = TestApplicationBuilder.build(true)
        )
        val response = post(client, mutation, token = "dummy")

        assertEquals(403, response.code)
    }

    @Test
    fun `should create an application and approved verification if the request is pre-verified and valid`() = JavalinTest.test(app) { _, client ->
        TestData.createApiToken(creatorId = adminVerein360.id, type = ApiTokenType.VERIFIED_APPLICATION)

        val mutation = createMutation(
            application = TestApplicationBuilder.build(true)
        )
        val response = post(client, mutation, token = "dummy")

        assertEquals(200, response.code)

        transaction {
            assertEquals(1, Applications.selectAll().count())
            assertEquals(1, ApplicationVerifications.selectAll().count())

            val application = ApplicationEntity.all().single()

            ApplicationVerificationEntity.find { ApplicationVerifications.applicationId eq application.id }.single().let {
                assertNotNull(it.verifiedDate)
                assertNull(it.rejectedDate)
                assertEquals(ApplicationVerificationExternalSource.VEREIN360, it.automaticSource)
            }
        }
    }

    @Test
    fun `should create an application and pending verification if the request is not pre-verified`() = JavalinTest.test(app) { _, client ->
        val mutation = createMutation(
            application = TestApplicationBuilder.build(false)
        )
        val response = post(client, mutation)

        assertEquals(200, response.code)

        transaction {
            assertEquals(1, Applications.selectAll().count())
            assertEquals(1, ApplicationVerifications.selectAll().count())

            val application = ApplicationEntity.all().single()

            ApplicationVerificationEntity.find { ApplicationVerifications.applicationId eq application.id }.single().let {
                assertNull(it.verifiedDate)
                assertNull(it.rejectedDate)
                assertEquals(ApplicationVerificationExternalSource.NONE, it.automaticSource)
            }
        }
    }

    private fun createMutation(
        project: String = "bayern.ehrenamtskarte.app",
        regionId: Int = 1,
        application: ApplicationInput
    ): String {
        val variables = AddEakApplication.Variables(
            application = application,
            regionId = regionId,
            project = project
        )
        val mutation = AddEakApplication(variables)
        return GraphQLRequestSerializer.serializeMutation(mutation)
    }
}
