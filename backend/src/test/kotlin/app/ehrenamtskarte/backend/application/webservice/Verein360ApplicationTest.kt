package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.GraphqlApiTest
import app.ehrenamtskarte.backend.application.database.ApplicationEntity
import app.ehrenamtskarte.backend.application.database.ApplicationVerificationEntity
import app.ehrenamtskarte.backend.application.database.ApplicationVerificationExternalSource
import app.ehrenamtskarte.backend.application.database.ApplicationVerifications
import app.ehrenamtskarte.backend.application.database.Applications
import app.ehrenamtskarte.backend.application.webservice.schema.create.Application
import app.ehrenamtskarte.backend.auth.database.ApiTokenType
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
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull

internal class Verein360ApplicationTest : GraphqlApiTest() {

    private val adminVerein360 = TestAdministrators.BAYERN_VEREIN_360

    @BeforeEach
    fun cleanUp() {
        transaction {
            ApplicationVerifications.deleteAll()
            Applications.deleteAll()
        }
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

    private fun createMutation(
        project: String = "bayern.ehrenamtskarte.app",
        regionId: Int = 1,
        application: Application
    ): String {
        val applicationJson = GraphQLRequestSerializer.serializeObject(application)
        return """
        mutation AddEakApplication {
            addEakApplication(
                project: "$project"
                regionId: $regionId
                application: $applicationJson
            )
        }
        """.trimIndent()
    }
}
