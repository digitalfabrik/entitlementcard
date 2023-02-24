package app.ehrenamtskarte.backend.application.webservice.utils

import app.ehrenamtskarte.backend.application.webservice.schema.view.ApplicationVerificationView
import com.expediagroup.graphql.generator.annotations.GraphQLIgnore

interface ApplicationVerificationsHolder {
    @GraphQLIgnore
    fun extractApplicationVerifications(): List<ApplicationVerificationView>
}
