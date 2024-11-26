package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.IntegrationTest
import app.ehrenamtskarte.backend.application.database.ApplicationVerifications
import app.ehrenamtskarte.backend.application.database.Applications
import app.ehrenamtskarte.backend.application.webservice.utils.ApplicationHandler
import app.ehrenamtskarte.backend.auth.webservice.JwtPayload
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.helper.TestApplicationBuilder
import graphql.schema.DataFetchingEnvironment
import io.mockk.every
import io.mockk.mockk
import io.mockk.mockkConstructor
import io.mockk.verify
import jakarta.servlet.http.Part
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.io.File
import kotlin.test.assertFailsWith

internal class EakApplicationMutationServiceTest : IntegrationTest() {

    @BeforeEach
    fun setUp() {
        transaction {
            ApplicationVerifications.deleteAll()
            Applications.deleteAll()
        }
    }

    private val mockDfe = mockk<DataFetchingEnvironment>()
    private val mockContext = mockk<GraphQLContext>()
    private val mockJwtPayload = mockk<JwtPayload>()
    private val mockApplicationData = File("mockFile1")
    private val mockFiles = listOf<Part>()

    @Test
    fun addEakApplication_storesApplicationSuccessfully() {
        every { mockDfe.getContext<GraphQLContext>() } returns mockContext
        every { mockContext.enforceSignedIn() } returns mockJwtPayload
        every { mockContext.backendConfiguration } returns loadTestConfig()
        every { mockContext.applicationData } returns mockApplicationData
        every { mockContext.files } returns mockFiles

        mockkConstructor(ApplicationHandler::class)
        every { anyConstructed<ApplicationHandler>().sendApplicationMails(any(), any(), any()) } returns Unit
        every { anyConstructed<ApplicationHandler>().setApplicationVerificationToVerifiedNow(any()) } returns Unit

        val application = TestApplicationBuilder.build(false)

        val service = EakApplicationMutationService()
        transaction {
            val applicationsBefore = Applications.selectAll().count()

            val result = service.addEakApplication(1, application, "bayern.ehrenamtskarte.app", mockDfe)

            assertTrue(result.data)
            assertEquals(applicationsBefore + 1, Applications.selectAll().count())
            verify(exactly = 1) { anyConstructed<ApplicationHandler>().sendApplicationMails(any(), any(), any()) }
            verify(exactly = 0) { anyConstructed<ApplicationHandler>().setApplicationVerificationToVerifiedNow(any()) }
        }
    }

    @Test
    fun addEakApplication_storesNoApplicationIfIsVerifiedButNoToken() {
        every { mockDfe.getContext<GraphQLContext>() } returns mockContext
        every { mockContext.enforceSignedIn() } returns mockJwtPayload
        every { mockContext.backendConfiguration } returns loadTestConfig()
        every { mockContext.applicationData } returns mockApplicationData
        every { mockContext.files } returns mockFiles

        mockkConstructor(ApplicationHandler::class)
        every { anyConstructed<ApplicationHandler>().sendApplicationMails(any(), any(), any()) } returns Unit

        val application = TestApplicationBuilder.build(true)

        val service = EakApplicationMutationService()
        assertFailsWith<UnauthorizedException> {
            transaction {
                val applicationsBefore = Applications.selectAll().count()

                val result = service.addEakApplication(1, application, "bayern.ehrenamtskarte.app", mockDfe)

                assertFalse(result.data)
                assertEquals(applicationsBefore, Applications.selectAll().count())
                verify(exactly = 0) { anyConstructed<ApplicationHandler>().sendApplicationMails(any(), any(), any()) }
                verify(exactly = 0) { anyConstructed<ApplicationHandler>().setApplicationVerificationToVerifiedNow(any()) }
            }
        }
    }
}
