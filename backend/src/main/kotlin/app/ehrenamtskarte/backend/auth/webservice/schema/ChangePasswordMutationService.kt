package app.ehrenamtskarte.backend.auth.webservice.schema

import app.ehrenamtskarte.backend.db.repositories.AdministratorsRepository
import app.ehrenamtskarte.backend.graphql.getAuthContext
import app.ehrenamtskarte.backend.common.webservice.context
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidCredentialsException
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
