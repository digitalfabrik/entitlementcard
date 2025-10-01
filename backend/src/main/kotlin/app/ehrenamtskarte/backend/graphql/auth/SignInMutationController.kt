package app.ehrenamtskarte.backend.graphql.auth

import app.ehrenamtskarte.backend.db.repositories.AdministratorsRepository
import app.ehrenamtskarte.backend.graphql.auth.types.Administrator
import app.ehrenamtskarte.backend.graphql.auth.types.AuthData
import app.ehrenamtskarte.backend.graphql.auth.types.SignInPayload
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidCredentialsException
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import jakarta.servlet.http.HttpServletRequest
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.LoggerFactory
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.MutationMapping
import org.springframework.stereotype.Controller

@Controller
class SignInMutationController(
    private val request: HttpServletRequest,
) {
    @GraphQLDescription("Signs in an administrator")
    @MutationMapping
    fun signIn(
        @Argument project: String,
        @Argument authData: AuthData,
    ): SignInPayload {
        val logger = LoggerFactory.getLogger(SignInMutationController::class.java)

        val administratorEntity = transaction {
            AdministratorsRepository.findByAuthData(project, authData.email, authData.password)
        }
        if (administratorEntity == null) {
            // This logging is used for rate limiting
            // See https://git.tuerantuer.org/DF/salt/pulls/187
            logger.info("${request.remoteAddr} ${authData.email} failed to log in")
            throw InvalidCredentialsException()
        }

        val administrator = Administrator.fromDbEntity(administratorEntity)
        val token = JwtService.createToken(administrator)
        return SignInPayload(token)
    }
}
