package app.ehrenamtskarte.backend.auth.webservice.schema

import app.ehrenamtskarte.backend.auth.database.repos.AdministratorsRepository
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Administrator
import app.ehrenamtskarte.backend.auth.webservice.schema.types.AuthData
import app.ehrenamtskarte.backend.auth.webservice.schema.types.SignInPayload
import com.expediagroup.graphql.annotations.GraphQLDescription
import org.jetbrains.exposed.sql.transactions.transaction


@Suppress("unused")
class SignInMutationService {
    @GraphQLDescription("Signs in an administrator")
    fun signIn(authData: AuthData): SignInPayload? {
        val administratorEntity = transaction {
            AdministratorsRepository.findByAuthData(authData)
        } ?: return null
        val administrator = Administrator(administratorEntity.id.value, administratorEntity.username)
        val token = "TODO" // TODO generate a token for login
        return SignInPayload(administrator, token)
    }
}
