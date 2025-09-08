package app.ehrenamtskarte.backend.graphql.auth.schema

import app.ehrenamtskarte.backend.shared.webservice.context
import app.ehrenamtskarte.backend.db.repositories.AdministratorsRepository
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidCredentialsException
import app.ehrenamtskarte.backend.graphql.auth.JwtService
import app.ehrenamtskarte.backend.graphql.auth.schema.types.Administrator
import app.ehrenamtskarte.backend.graphql.auth.schema.types.AuthData
import app.ehrenamtskarte.backend.graphql.auth.schema.types.SignInPayload
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
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
            val context = dfe.graphQlContext.context
            // This logging is used for rate limiting
            // See https://git.tuerantuer.org/DF/salt/pulls/187
            logger.info("${context.remoteIp} ${authData.email} failed to log in")
            throw InvalidCredentialsException()
        }

        val administrator = Administrator.fromDbEntity(administratorEntity)
        val token = JwtService.createToken(administrator)
        return SignInPayload(token)
    }
}
