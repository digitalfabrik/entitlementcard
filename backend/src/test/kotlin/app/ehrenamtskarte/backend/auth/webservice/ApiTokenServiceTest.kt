package app.ehrenamtskarte.backend.auth.webservice

import app.ehrenamtskarte.backend.IntegrationTest
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.shared.webservice.GraphQLContext
import app.ehrenamtskarte.backend.shared.webservice.context
import app.ehrenamtskarte.backend.db.entities.AdministratorEntity
import app.ehrenamtskarte.backend.db.entities.Administrators
import app.ehrenamtskarte.backend.db.entities.ApiTokenType
import app.ehrenamtskarte.backend.db.entities.ApiTokens
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.graphql.auth.JwtPayload
import app.ehrenamtskarte.backend.graphql.auth.schema.ApiTokenQueryService
import app.ehrenamtskarte.backend.graphql.auth.schema.ApiTokenService
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.TestData
import graphql.schema.DataFetchingEnvironment
import io.mockk.every
import io.mockk.mockk
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertThrows
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.MethodSource
import java.time.LocalDate

internal class ApiTokenServiceTest : IntegrationTest() {
    private val mockDfe = mockk<DataFetchingEnvironment>()
    private val mockContext = mockk<GraphQLContext>()
    private val mockJwtPayload = mockk<JwtPayload>()

    @BeforeEach
    fun setUp() {
        every { mockDfe.graphQlContext.context } returns mockContext
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
                    AdministratorEntity.find { Administrators.id eq mockJwtPayload.adminId }.single(),
                ),
            )
        }
    }

    @Test
    fun createApiToken_throwsExceptionWhenAdminNotFound() {
        every { mockJwtPayload.adminId } returns 1234

        transaction {
            assertThrows(UnauthorizedException::class.java) {
                ApiTokenService().createApiToken(1, mockDfe)
            }
        }
    }

    companion object {
        @JvmStatic
        fun provideDeleteTestCases() =
            listOf(
                TestCase(
                    TestAdministrators.BAYERN_VEREIN_360.id,
                    TestAdministrators.BAYERN_VEREIN_360.id,
                    ApiTokenType.VERIFIED_APPLICATION,
                    1,
                ),
                TestCase(
                    TestAdministrators.KOBLENZ_PROJECT_ADMIN.id,
                    TestAdministrators.KOBLENZ_PROJECT_ADMIN.id,
                    ApiTokenType.USER_IMPORT,
                    1,
                ),
                TestCase(
                    TestAdministrators.KOBLENZ_PROJECT_ADMIN_2.id,
                    TestAdministrators.KOBLENZ_PROJECT_ADMIN.id,
                    ApiTokenType.USER_IMPORT,
                    1,
                ),
                TestCase(
                    TestAdministrators.KOBLENZ_PROJECT_ADMIN.id,
                    TestAdministrators.NUERNBERG_PROJECT_ADMIN.id,
                    ApiTokenType.USER_IMPORT,
                    0,
                ),
                TestCase(
                    TestAdministrators.BAYERN_VEREIN_360.id,
                    TestAdministrators.KOBLENZ_PROJECT_ADMIN.id,
                    ApiTokenType.USER_IMPORT,
                    0,
                ),
                TestCase(
                    TestAdministrators.BAYERN_VEREIN_360.id,
                    TestAdministrators.BAYERN_VEREIN_360.id,
                    ApiTokenType.USER_IMPORT,
                    0,
                ),
            )
    }

    data class TestCase(
        val actingAdmin: Int,
        val tokenAdmin: Int,
        val type: ApiTokenType,
        val expectedDeletedTokens: Int,
    )

    @ParameterizedTest
    @MethodSource("provideDeleteTestCases")
    fun test(testCase: TestCase) {
        val (actingAdmin, tokenAdmin, type, expectedDeletedTokens) = testCase
        every { mockJwtPayload.adminId } returns actingAdmin

        transaction {
            val tokenId = TestData.createApiToken(creatorId = tokenAdmin, type = type)
            val numberOfTokensBefore = ApiTokens.selectAll().where(ApiTokens.id eq tokenId).count()
            assertEquals(1, numberOfTokensBefore)

            ApiTokenService().deleteApiToken(tokenId, mockDfe)

            val numberOfTokensAfter = ApiTokens.selectAll().where(ApiTokens.id eq tokenId).count()
            assertEquals(numberOfTokensBefore - expectedDeletedTokens, numberOfTokensAfter)
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
                    AdministratorEntity.find { Administrators.id eq mockJwtPayload.adminId }.single(),
                ),
            )
        }
    }

    @Test
    fun deleteApiToken_throwsExceptionWhenAdminNotFound() {
        every { mockJwtPayload.adminId } returns 1234

        transaction {
            assertThrows(UnauthorizedException::class.java) {
                ApiTokenService().deleteApiToken(1, mockDfe)
            }
        }
    }

    @Test
    fun getApiTokenMetaData_returnsMetaDataSuccessfully() {
        every { mockJwtPayload.adminId } returns TestAdministrators.KOBLENZ_PROJECT_ADMIN.id

        transaction {
            val tokenId = TestData.createApiToken(
                creatorId = TestAdministrators.KOBLENZ_PROJECT_ADMIN.id,
                type = ApiTokenType.USER_IMPORT,
            )

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
                    AdministratorEntity.find { Administrators.id eq mockJwtPayload.adminId }.single(),
                ),
            )
        }
    }

    @Test
    fun getApiTokenMetaData_throwsExceptionWhenAdminNotFound() {
        every { mockJwtPayload.adminId } returns 1234

        transaction {
            assertThrows(UnauthorizedException::class.java) {
                ApiTokenQueryService().getApiTokenMetaData(mockDfe)
            }
        }
    }

    @Test
    fun getApiTokenMetaData_returnsNoTokensOfOtherProjects() {
        every { mockJwtPayload.adminId } returns TestAdministrators.KOBLENZ_PROJECT_ADMIN.id

        transaction {
            TestData.createApiToken(
                creatorId = TestAdministrators.NUERNBERG_PROJECT_ADMIN.id,
                type = ApiTokenType.USER_IMPORT,
            )

            val metaData = ApiTokenQueryService().getApiTokenMetaData(mockDfe)
            assertEquals(0, metaData.size)
        }
    }

    @Test
    fun getApiTokenMetaData_returnsOnlyVerifiedApplicationTokensForExternalUser() {
        every { mockJwtPayload.adminId } returns TestAdministrators.BAYERN_VEREIN_360.id

        transaction {
            TestData.createApiToken(
                creatorId = TestAdministrators.KOBLENZ_PROJECT_ADMIN.id,
                type = ApiTokenType.USER_IMPORT,
            )
            TestData.createApiToken(
                token = "dummy2",
                creatorId = TestAdministrators.BAYERN_VEREIN_360.id,
                type = ApiTokenType.VERIFIED_APPLICATION,
            )

            val metaData = ApiTokenQueryService().getApiTokenMetaData(mockDfe)
            assertEquals(1, metaData.size)
            assertEquals(ApiTokenType.VERIFIED_APPLICATION, metaData[0].type)
        }
    }
}
