package app.ehrenamtskarte.backend.auth.webservice.schema

import app.ehrenamtskarte.backend.auth.database.repos.AdministratorsRepository
import app.ehrenamtskarte.backend.auth.webservice.JwtService
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Administrator
import app.ehrenamtskarte.backend.auth.webservice.schema.types.AuthData
import app.ehrenamtskarte.backend.auth.webservice.schema.types.SignInPayload
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.exceptions.GraphQLKotlinException
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.LoggerFactory

@Suppress("unused")
class SignInMutationService {
    @GraphQLDescription("Signs in an administrator")
    fun signIn(project: String, authData: AuthData, dfe: DataFetchingEnvironment): SignInPayload {
        val logger = LoggerFactory.getLogger(SignInMutationService::class.java)

        val administratorEntity = transaction {
            AdministratorsRepository.findByAuthData(project, authData.email, authData.password)
        }
        if (administratorEntity == null) {
            val context = dfe.getContext<GraphQLContext>()
            logger.info("${context.remoteIp} ${authData.email} failed to log in")
            throw GraphQLKotlinException("Invalid credentials")
        }

        val administrator = Administrator.fromDbEntity(administratorEntity)
        val token = JwtService.createToken(administrator)
        return SignInPayload(token)
    }
}
