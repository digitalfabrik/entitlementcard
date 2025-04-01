package app.ehrenamtskarte.backend.auth.webservice.schema

import app.ehrenamtskarte.backend.auth.database.repos.AdministratorsRepository
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidCredentialsException
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class ChangePasswordMutationService {
    @GraphQLDescription("Changes an administrator's password")
    fun changePassword(
        project: String,
        email: String,
        currentPassword: String,
        newPassword: String,
        dfe: DataFetchingEnvironment,
    ): Boolean {
        val context = dfe.getContext<GraphQLContext>()
        val jwtPayload = context.enforceSignedIn()
        transaction {
            val administratorEntity =
                AdministratorsRepository.findByAuthData(project, email, currentPassword)
                    ?: throw InvalidCredentialsException()

            if (administratorEntity.id.value != jwtPayload.adminId) {
                throw UnauthorizedException()
            }

            AdministratorsRepository.changePassword(administratorEntity, newPassword)
        }
        return true
    }
}
