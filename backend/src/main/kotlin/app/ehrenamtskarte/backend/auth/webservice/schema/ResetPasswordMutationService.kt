package app.ehrenamtskarte.backend.auth.webservice.schema

import com.expediagroup.graphql.generator.annotations.GraphQLDescription

@Suppress("unused")
class ResetPasswordMutationService {
    @GraphQLDescription("Sends a mail that allows the administrator to reset their password.")
    fun sendResetMail(project: String, email: String): Boolean {
        return true
    }

    @GraphQLDescription("Reset the administrator's password")
    fun resetPassword(project: String, email: String, passwordResetHash: String, newPassword: String): Boolean {
        return true
    }
}
