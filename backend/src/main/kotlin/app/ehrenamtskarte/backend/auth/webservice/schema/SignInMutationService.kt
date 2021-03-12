package app.ehrenamtskarte.backend.auth.webservice.schema

import app.ehrenamtskarte.backend.auth.database.repos.AdministratorsRepository
import app.ehrenamtskarte.backend.auth.webservice.JwtService
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Administrator
import app.ehrenamtskarte.backend.auth.webservice.schema.types.AuthData
import app.ehrenamtskarte.backend.auth.webservice.schema.types.SignInPayload
import com.expediagroup.graphql.annotations.GraphQLDescription
import com.expediagroup.graphql.exceptions.GraphQLKotlinException
import org.jetbrains.exposed.sql.transactions.transaction


@Suppress("unused")
class SignInMutationService {
    @GraphQLDescription("Signs in an administrator")
    fun signIn(authData: AuthData): SignInPayload {
        val administratorEntity = transaction {
            AdministratorsRepository.findByAuthData(authData.email, authData.password)
        } ?: throw GraphQLKotlinException("Invalid credentials")
        val administrator = Administrator(administratorEntity.id.value, administratorEntity.email)
        val token = JwtService.createToken(administrator)
        return SignInPayload(administrator, token)
    }
}
