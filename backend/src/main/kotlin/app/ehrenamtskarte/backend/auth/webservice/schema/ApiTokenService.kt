package app.ehrenamtskarte.backend.auth.webservice.schema

import app.ehrenamtskarte.backend.db.entities.Administrators
import app.ehrenamtskarte.backend.db.entities.ApiTokenType
import app.ehrenamtskarte.backend.db.entities.ApiTokens
import app.ehrenamtskarte.backend.auth.database.PasswordCrypto
import app.ehrenamtskarte.backend.db.entities.TOKEN_LENGTH
import app.ehrenamtskarte.backend.db.repositories.ApiTokensRepository
import app.ehrenamtskarte.backend.auth.getAuthContext
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.auth.webservice.schema.types.ApiTokenMetaData
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Role
import app.ehrenamtskarte.backend.common.webservice.context
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.Op
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.transactions.transaction
import java.security.SecureRandom
import java.time.LocalDate
import java.util.Base64

fun getByteArrayLength() = 3 * TOKEN_LENGTH / 4 // 4*(n/3) chars are needed to represent n bytes

@Suppress("unused")
class ApiTokenService {
    @GraphQLDescription("Creates a new api token for user import endpoint")
    fun createApiToken(expiresIn: Int, dfe: DataFetchingEnvironment): String {
        val context = dfe.graphQlContext.context
        val authContext = context.getAuthContext()

        val admin = authContext.admin.takeIf { Authorizer.mayAddApiTokensInProject(it) }
            ?: throw ForbiddenException()

        val type = if (admin.role == Role.PROJECT_ADMIN.db_value) {
            ApiTokenType.USER_IMPORT
        } else {
            ApiTokenType.VERIFIED_APPLICATION
        }

        val bytes = ByteArray(getByteArrayLength())
        SecureRandom().nextBytes(bytes)
        val token = Base64.getEncoder().encodeToString(bytes)

        val tokenHash = PasswordCrypto.hashWithSHA256(token.toByteArray())
        val expirationDate = LocalDate.now().plusMonths(expiresIn.toLong())

        transaction {
            ApiTokensRepository.insert(tokenHash, admin.id, expirationDate, admin.projectId, type)
        }

        return token
    }

    @GraphQLDescription("Deletes a selected API token")
    fun deleteApiToken(id: Int, dfe: DataFetchingEnvironment): Int {
        val context = dfe.graphQlContext.context
        val admin = context.getAuthContext().admin.takeIf { Authorizer.mayDeleteApiTokensInProject(it) }
            ?: throw ForbiddenException()

        transaction {
            if (admin.role == Role.PROJECT_ADMIN.db_value) {
                ApiTokens.deleteWhere {
                    (ApiTokens.id eq id) and (projectId eq admin.projectId)
                }
            }
            if (admin.role == Role.EXTERNAL_VERIFIED_API_USER.db_value) {
                ApiTokens.deleteWhere {
                    (ApiTokens.id eq id) and (projectId eq admin.projectId) and
                        (type eq ApiTokenType.VERIFIED_APPLICATION)
                }
            }
        }

        return id
    }
}

@Suppress("unused")
class ApiTokenQueryService {
    @GraphQLDescription("Gets metadata of all api tokens for a project")
    fun getApiTokenMetaData(dfe: DataFetchingEnvironment): List<ApiTokenMetaData> {
        val context = dfe.graphQlContext.context
        val admin = context.getAuthContext().admin.takeIf { Authorizer.mayViewApiMetadataInProject(it) }
            ?: throw ForbiddenException()

        return transaction {
            (ApiTokens leftJoin Administrators)
                .select(ApiTokens.columns + Administrators.email)
                .where {
                    when (admin.role) {
                        Role.EXTERNAL_VERIFIED_API_USER.db_value -> (Administrators.email eq admin.email) and
                            (ApiTokens.type eq ApiTokenType.VERIFIED_APPLICATION)
                        Role.PROJECT_ADMIN.db_value -> ApiTokens.projectId eq admin.projectId
                        else -> Op.FALSE
                    }
                }
                .map {
                    ApiTokenMetaData(
                        it[ApiTokens.id].value,
                        it[Administrators.email],
                        it[ApiTokens.expirationDate].toString(),
                        it[ApiTokens.type],
                    )
                }
        }
    }
}
