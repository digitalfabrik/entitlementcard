package app.ehrenamtskarte.backend.graphql.auth.schema

import app.ehrenamtskarte.backend.db.repositories.AdministratorsRepository
import app.ehrenamtskarte.backend.shared.exceptions.UnauthorizedException
import app.ehrenamtskarte.backend.graphql.shared.exceptions.InvalidCredentialsException
import app.ehrenamtskarte.backend.graphql.getAuthContext
import app.ehrenamtskarte.backend.graphql.shared.context
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class ChangePasswordMutationService {
    @GraphQLDescription("Changes an administrator's password")
    fun changePassword(
        email: String,
        currentPassword: String,
        newPassword: String,
        dfe: DataFetchingEnvironment,
    ): Boolean {
        val context = dfe.graphQlContext.context
        val authContext = context.getAuthContext()

        transaction {
            val administratorEntity =
                AdministratorsRepository.findByAuthData(authContext.project, email, currentPassword)
                    ?: throw InvalidCredentialsException()

            if (administratorEntity.id.value != authContext.adminId) {
                throw UnauthorizedException()
            }

            AdministratorsRepository.changePassword(administratorEntity, newPassword)
        }
        return true
    }
}
