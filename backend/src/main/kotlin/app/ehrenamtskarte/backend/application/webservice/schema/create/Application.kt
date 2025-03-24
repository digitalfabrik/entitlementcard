package app.ehrenamtskarte.backend.application.webservice.schema.create

import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import app.ehrenamtskarte.backend.application.webservice.utils.ApplicationVerificationsHolder
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable
import com.expediagroup.graphql.generator.annotations.GraphQLDescription

enum class ApplicationType {
    FIRST_APPLICATION,
    RENEWAL_APPLICATION,
}

enum class BavariaCardType {
    BLUE,
    GOLDEN,
}

@GraphQLDescription(
    "An application for the Bayerische Ehrenamtskarte.\n" +
        "The field `cardType` specifies whether `blueCardEntitlement` or `goldenCardEntitlement` must be present/null.\n" +
        "The field `applicationType` must not be null if and only if `cardType` is BavariaCardType.BLUE.",
)
data class Application(
    val personalData: PersonalData,
    val applicationDetails: ApplicationDetails,
) : JsonFieldSerializable, ApplicationVerificationsHolder {
    override fun extractApplicationVerifications() =
        listOfNotNull(
            applicationDetails.blueCardEntitlement?.extractApplicationVerifications(),
            applicationDetails.goldenCardEntitlement?.extractApplicationVerifications(),
        ).flatten()

    override fun toJsonField(): JsonField =
        JsonField(
            name = "application",
            type = Type.Array,
            value = listOfNotNull(
                personalData.toJsonField(),
                applicationDetails.toJsonField(),
            ),
        )
}
