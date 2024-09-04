package app.ehrenamtskarte.backend.auth.webservice.schema

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.database.Administrators
import app.ehrenamtskarte.backend.auth.database.ApiTokens
import app.ehrenamtskarte.backend.auth.database.TOKEN_LENGTH
import app.ehrenamtskarte.backend.auth.database.repos.ApiTokensRepository
import app.ehrenamtskarte.backend.auth.webservice.schema.types.ApiTokenMetaData
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import at.favre.lib.crypto.bcrypt.BCrypt
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import java.security.SecureRandom
import java.time.LocalDate
import java.util.Base64

fun getByteArrayLength() = 3 * TOKEN_LENGTH / 4 // 4*(n/3) chars are needed to represent n bytes

@Suppress("unused")
class ApiTokenService {
    @GraphQLDescription("Creates a new api token for user upload endpoint")
    fun createApiToken(expiresIn: Int, dfe: DataFetchingEnvironment): String {
        val context = dfe.getContext<GraphQLContext>()
        val jwtPayload = context.enforceSignedIn()

        val random = SecureRandom()
        val bytes = ByteArray(getByteArrayLength())
        random.nextBytes(bytes)
        val token = Base64.getEncoder()
            .encodeToString(bytes)

        val encryptedToken = BCrypt.withDefaults().hash(11, token.toCharArray())
        val expirationDate = LocalDate.now().plusMonths(expiresIn.toLong())

        transaction {
            val admin =
                AdministratorEntity.findById(jwtPayload.adminId)
                    ?: throw UnauthorizedException()
            ApiTokensRepository.insert(encryptedToken, admin.id, expirationDate, admin.projectId)
        }

        return token
    }

    @GraphQLDescription("Deletes a selected API token")
    fun deleteApiToken(id: Int, dfe: DataFetchingEnvironment): Int {
        val context = dfe.getContext<GraphQLContext>()
        val jwtPayload = context.enforceSignedIn()

        transaction {
            val admin =
                AdministratorEntity.findById(jwtPayload.adminId)
                    ?: throw UnauthorizedException()

            ApiTokens.deleteWhere {
                (ApiTokens.id eq id) and (creatorId eq admin.id)
            }
        }
        return id
    }
}

@Suppress("unused")
class ApiTokenQueryService {
    @GraphQLDescription("Gets metadata of all api tokes for a project")
    fun getApiTokenMetaData(dfe: DataFetchingEnvironment): List<ApiTokenMetaData> {
        val context = dfe.getContext<GraphQLContext>()
        val jwtPayload = context.enforceSignedIn()
        return transaction {
            val admin =
                AdministratorEntity.findById(jwtPayload.adminId)
                    ?: throw UnauthorizedException()

            (ApiTokens leftJoin Administrators)
                .select { ApiTokens.projectId eq admin.projectId }
                .map { row ->
                    val creatorEmail = row[Administrators.email]
                    val tokenId = row[ApiTokens.id].value
                    ApiTokenMetaData(
                        tokenId,
                        creatorEmail,
                        row[ApiTokens.expirationDate].toString()
                    )
                }
        }
    }
}
