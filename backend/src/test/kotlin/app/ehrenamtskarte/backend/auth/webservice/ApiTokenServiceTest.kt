package app.ehrenamtskarte.backend.auth.webservice

import app.ehrenamtskarte.backend.IntegrationTest
import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.database.Administrators
import app.ehrenamtskarte.backend.auth.database.ApiTokens
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.auth.webservice.schema.ApiTokenQueryService
import app.ehrenamtskarte.backend.auth.webservice.schema.ApiTokenService
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.TestData
import graphql.schema.DataFetchingEnvironment
import io.mockk.every
import io.mockk.mockk
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertThrows
import org.junit.Assert.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.time.LocalDate

internal class ApiTokenServiceTest : IntegrationTest() {

    private val mockDfe = mockk<DataFetchingEnvironment>()
    private val mockContext = mockk<GraphQLContext>()
    private val mockJwtPayload = mockk<JwtPayload>()

    @BeforeEach
    fun setUp() {
        every { mockDfe.getContext<GraphQLContext>() } returns mockContext
        every { mockContext.enforceSignedIn() } returns mockJwtPayload
        transaction {
            ApiTokens.deleteAll()
        }
    }

    @Test
    fun createApiToken_createsTokenSuccessfully() {
        every { mockJwtPayload.adminId } returns TestAdministrators.KOBLENZ_PROJECT_ADMIN.id

        transaction {
            val numberOfTokensBefore = ApiTokens.selectAll().count()
            ApiTokenService().createApiToken(3, mockDfe)
            val numberOfTokensAfter = ApiTokens.selectAll().count()
            assertEquals(numberOfTokensBefore + 1, numberOfTokensAfter)
        }
    }

    @Test
    fun createApiToken_throwsForbiddenExceptionWhenNotAuthorized() {
        every { mockJwtPayload.adminId } returns TestAdministrators.NUERNBERG_PROJECT_STORE_MANAGER.id

        transaction {
            assertThrows(ForbiddenException::class.java) {
                ApiTokenService().createApiToken(1, mockDfe)
            }
            assertFalse(
                Authorizer.mayAddApiTokensInProject(
                    AdministratorEntity.find { Administrators.id eq mockJwtPayload.adminId }.single()
                )
            )
        }
    }

    @Test
    fun createApiToken_throwsExceptionWhenAdminNotFound() {
        every { mockJwtPayload.adminId } returns 1234

        transaction {
            assertThrows(ForbiddenException::class.java) {
                ApiTokenService().createApiToken(1, mockDfe)
            }
        }
    }

    @Test
    fun deleteApiToken_deletesTokenSuccessfully() {
        every { mockJwtPayload.adminId } returns TestAdministrators.KOBLENZ_PROJECT_ADMIN.id

        transaction {
            val tokenId = TestData.createApiToken(creatorId = TestAdministrators.KOBLENZ_PROJECT_ADMIN.id)
            val tokenExists = ApiTokens.select { ApiTokens.id eq tokenId }.count() > 0
            assertTrue(tokenExists)

            ApiTokenService().deleteApiToken(tokenId, mockDfe)

            val tokenNoLongerExists = ApiTokens.select { ApiTokens.id eq tokenId }.singleOrNull() == null
            assertTrue(tokenNoLongerExists)
        }
    }

    @Test
    fun deleteApiToken_deletesFromOtherAdminTokenSuccessfully() {
        every { mockJwtPayload.adminId } returns TestAdministrators.KOBLENZ_PROJECT_ADMIN.id

        transaction {
            TestData.createApiToken(creatorId = TestAdministrators.KOBLENZ_PROJECT_ADMIN_2.id)

            val tokenBefore = ApiTokens.select { ApiTokens.id eq 1 }.count() > 0
            assertTrue(tokenBefore)

            ApiTokenService().deleteApiToken(1, mockDfe)

            val tokenAfter = ApiTokens.select { ApiTokens.id eq 1 }.singleOrNull()
            assertNull(tokenAfter)
        }
    }

    @Test
    fun deleteApiToken_deletesNoTokenFormOtherProject() {
        every { mockJwtPayload.adminId } returns TestAdministrators.KOBLENZ_PROJECT_ADMIN.id
        transaction {
            val tokenId = TestData.createApiToken(creatorId = TestAdministrators.NUERNBERG_PROJECT_ADMIN.id)

            val numberOfTokensBefore = ApiTokens.selectAll().count()
            ApiTokenService().deleteApiToken(tokenId, mockDfe)
            val numberOfTokensAfter = ApiTokens.selectAll().count()
            assert(numberOfTokensBefore == numberOfTokensAfter)
        }
    }

    @Test
    fun deleteApiToken_throwsForbiddenExceptionWhenNotAuthorized() {
        every { mockJwtPayload.adminId } returns TestAdministrators.NUERNBERG_PROJECT_STORE_MANAGER.id

        transaction {
            assertThrows(ForbiddenException::class.java) {
                ApiTokenService().deleteApiToken(1, mockDfe)
            }
            assertFalse(
                Authorizer.mayAddApiTokensInProject(
                    AdministratorEntity.find { Administrators.id eq mockJwtPayload.adminId }.single()
                )
            )
        }
    }

    @Test
    fun deleteApiToken_throwsExceptionWhenAdminNotFound() {
        every { mockJwtPayload.adminId } returns 1234

        transaction {
            assertThrows(ForbiddenException::class.java) {
                ApiTokenService().deleteApiToken(1, mockDfe)
            }
        }
    }

    @Test
    fun getApiTokenMetaData_returnsMetaDataSuccessfully() {
        every { mockJwtPayload.adminId } returns TestAdministrators.KOBLENZ_PROJECT_ADMIN.id

        transaction {
            val tokenId = TestData.createApiToken(creatorId = TestAdministrators.KOBLENZ_PROJECT_ADMIN.id)

            val metaData = ApiTokenQueryService().getApiTokenMetaData(mockDfe)
            assertEquals(1, metaData.size)
            assertEquals(tokenId, metaData[0].id)
            assertEquals(TestAdministrators.KOBLENZ_PROJECT_ADMIN.email, metaData[0].creatorEmail)
            assertEquals(LocalDate.now().plusYears(1).toString(), metaData[0].expirationDate)
        }
    }

    @Test
    fun getApiTokenMetaData_throwsForbiddenExceptionWhenNotAuthorized() {
        every { mockJwtPayload.adminId } returns TestAdministrators.NUERNBERG_PROJECT_STORE_MANAGER.id

        transaction {
            assertThrows(ForbiddenException::class.java) {
                ApiTokenQueryService().getApiTokenMetaData(mockDfe)
            }
            assertFalse(
                Authorizer.mayViewApiMetadataInProject(
                    AdministratorEntity.find { Administrators.id eq mockJwtPayload.adminId }.single()
                )
            )
        }
    }

    @Test
    fun getApiTokenMetaData_throwsExceptionWhenAdminNotFound() {
        every { mockJwtPayload.adminId } returns 1234

        transaction {
            assertThrows(ForbiddenException::class.java) {
                ApiTokenQueryService().getApiTokenMetaData(mockDfe)
            }
        }
    }

    @Test
    fun getApiTokenMetaData_returnsNoTokensOfOtherProjects() {
        every { mockJwtPayload.adminId } returns TestAdministrators.KOBLENZ_PROJECT_ADMIN.id

        transaction {
            TestData.createApiToken(creatorId = TestAdministrators.NUERNBERG_PROJECT_ADMIN.id)

            val metaData = ApiTokenQueryService().getApiTokenMetaData(mockDfe)
            assertEquals(0, metaData.size)
        }
    }
}
