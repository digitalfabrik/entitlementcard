package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.IntegrationTest
import app.ehrenamtskarte.backend.db.entities.ApplicationEntity
import app.ehrenamtskarte.backend.db.entities.Applications
import app.ehrenamtskarte.backend.generated.RejectApplicationStatus
import app.ehrenamtskarte.backend.generated.enums.ApplicationStatus
import app.ehrenamtskarte.backend.generated.rejectapplicationstatus.ApplicationAdmin
import app.ehrenamtskarte.backend.graphql.exceptions.MailNotSentException
import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.TestData
import app.ehrenamtskarte.backend.helper.toDataObject
import app.ehrenamtskarte.backend.helper.toErrorObject
import app.ehrenamtskarte.backend.shared.mail.Mailer
import app.ehrenamtskarte.backend.util.any
import app.ehrenamtskarte.backend.util.eq
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.jdbc.deleteAll
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito.doThrow
import org.mockito.Mockito.times
import org.mockito.Mockito.verify
import org.springframework.http.HttpStatus
import org.springframework.test.context.bean.override.mockito.MockitoBean
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

internal class RejectApplicationTest : IntegrationTest() {
    private val regionAdmin = TestAdministrators.EAK_REGION_ADMIN

    @MockitoBean
    private lateinit var mailer: Mailer

    @BeforeEach
    fun cleanUp() {
        transaction {
            Applications.deleteAll()
        }
    }

    @Test
    fun `should return a successful response when the application has been rejected and email has been sent`() {
        val applicationId = TestData.createApplication(
            regionId = regionAdmin.regionId,
            jsonValue = buildApplicationJson(),
        )

        val mutation = createMutation(applicationId = applicationId)
        val response = postGraphQL(mutation, regionAdmin.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val data = response.toDataObject<ApplicationAdmin>()

        assertEquals(ApplicationStatus.REJECTED, data.status)
        assertNotNull(data.statusResolvedDate)
        assertEquals("dummy", data.rejectionMessage)

        transaction {
            ApplicationEntity.find { Applications.id eq applicationId }.single().let {
                assertEquals(ApplicationEntity.Status.Rejected, it.status)
                assertNotNull(it.statusResolvedDate)
            }
        }

        verify(mailer, times(1)).sendApplicationRejectedMail(
            any(),
            applicantName = eq("Max Mustermann"),
            applicantAddress = eq("test@test.de"),
            rejectionMessage = eq("dummy"),
        )
    }

    @Test
    fun `should return a successful response when the application has been rejected but email failed`() {
        // Configure the mailer mock to throw an exception
        doThrow(MailNotSentException("test@test.de")).`when`(mailer).sendApplicationRejectedMail(
            any(),
            applicantName = any(),
            applicantAddress = any(),
            rejectionMessage = any(),
        )

        val applicationId = TestData.createApplication(
            regionId = regionAdmin.regionId,
            jsonValue = buildApplicationJson(),
        )

        val mutation = createMutation(applicationId = applicationId)
        val response = postGraphQL(mutation, regionAdmin.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val data = response.toDataObject<ApplicationAdmin>()

        assertEquals(ApplicationStatus.REJECTED, data.status)
        assertNotNull(data.statusResolvedDate)
        assertEquals("dummy", data.rejectionMessage)

        transaction {
            ApplicationEntity.find { Applications.id eq applicationId }.single().let {
                assertEquals(ApplicationEntity.Status.Rejected, it.status)
                assertNotNull(it.statusResolvedDate)
            }
        }

        // Verify that the response contains the expected error
        assertEquals(GraphQLExceptionCode.MAIL_NOT_SENT, response.toErrorObject().extensions.code)
    }

    @Test
    fun `should return an error when request not authorized`() {
        val applicationId = TestData.createApplication(regionAdmin.regionId)

        val mutation = createMutation(applicationId = applicationId)
        val response = postGraphQL(mutation)

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(GraphQLExceptionCode.UNAUTHORIZED, response.toErrorObject().extensions.code)
    }

    @Test
    fun `should return an error when an admin from another region tries to reject an application`() {
        val applicationId = TestData.createApplication(regionAdmin.regionId)

        val mutation = createMutation(applicationId = applicationId)
        val response = postGraphQL(mutation, TestAdministrators.EAK_REGION_ADMIN_FREINET.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(GraphQLExceptionCode.FORBIDDEN, response.toErrorObject().extensions.code)
    }

    @Test
    fun `should return an error if the application not found`() {
        val mutation = createMutation(applicationId = 999)
        val response = postGraphQL(mutation, regionAdmin.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals("Application not found", error.message)
        assertEquals(GraphQLExceptionCode.INVALID_INPUT, error.extensions.code)
    }

    @Test
    fun `should return an error if the application is already approved`() {
        val applicationId = TestData.createApplication(
            regionId = regionAdmin.regionId,
            status = ApplicationEntity.Status.Approved,
        )

        val mutation = createMutation(applicationId = applicationId)
        val response = postGraphQL(mutation, regionAdmin.getJwtToken())

        assertEquals(HttpStatus.OK, response.statusCode)

        val error = response.toErrorObject()

        assertEquals("Cannot set application to 'Rejected', is 'Approved'", error.message)
        assertEquals(GraphQLExceptionCode.INVALID_INPUT, error.extensions.code)

        transaction {
            ApplicationEntity.find { Applications.id eq applicationId }.single().let {
                assertEquals(ApplicationEntity.Status.Approved, it.status)
            }
        }
    }

    private fun buildApplicationJson(
        applicantFirstName: String = "Max",
        applicantLastName: String = "Mustermann",
        applicantEmail: String = "test@test.de",
    ): String =
        """
            {
                "name": "application",
                "type": "Array",
                "value": [
                    {
                        "name": "personalData",
                        "type": "Array",
                        "value": [
                            {
                                "name": "forenames",
                                "type": "String",
                                "value": "$applicantFirstName"
                            },
                            {
                                "name": "surname",
                                "type": "String",
                                "value": "$applicantLastName"
                            },
                            {
                                "name": "emailAddress",
                                "type": "String",
                                "value": "$applicantEmail"
                            }
                        ]
                    }
                ]
            }
        """.trimIndent()

    private fun createMutation(applicationId: Int, rejectionMessage: String = "dummy"): RejectApplicationStatus {
        val variables = RejectApplicationStatus.Variables(
            applicationId = applicationId,
            rejectionMessage = rejectionMessage,
        )
        return RejectApplicationStatus(variables)
    }
}
