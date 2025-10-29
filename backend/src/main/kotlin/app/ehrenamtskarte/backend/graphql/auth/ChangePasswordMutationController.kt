package app.ehrenamtskarte.backend.graphql.auth

import app.ehrenamtskarte.backend.db.repositories.AdministratorsRepository
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidCredentialsException
import app.ehrenamtskarte.backend.shared.exceptions.UnauthorizedException
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.MutationMapping
import org.springframework.stereotype.Controller

@Controller
class ChangePasswordMutationController {
    @GraphQLDescription("Changes an administrator's password")
    @MutationMapping
    fun changePassword(
        @Argument email: String,
        @Argument currentPassword: String,
        @Argument newPassword: String,
        dfe: DataFetchingEnvironment,
    ): Boolean {
        val authContext = dfe.requireAuthContext()

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
