package app.ehrenamtskarte.backend.application.webservice.utils

import com.expediagroup.graphql.generator.annotations.GraphQLIgnore

data class ExtractedApplicationVerification(
    val contactName: String,
    val contactEmailAddress: String,
    val organizationName: String,
)

interface ApplicationVerificationsHolder {
    @GraphQLIgnore
    fun extractApplicationVerifications(): List<ExtractedApplicationVerification>
}
