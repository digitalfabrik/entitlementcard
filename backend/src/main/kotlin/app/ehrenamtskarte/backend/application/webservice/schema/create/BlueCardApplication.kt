package app.ehrenamtskarte.backend.application.webservice.schema.create

import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable

data class BlueCardApplication(
    val personalData: PersonalData,
    val applicationType: ApplicationType,
    val entitlement: BlueCardEntitlement,
    val hasAcceptedPrivacyPolicy: Boolean,
    val givenInformationIsCorrectAndComplete: Boolean
) : JsonFieldSerializable {
    override fun toJsonField(): JsonField {
        return JsonField(
            name = "blue-card-application",
            translations = mapOf("de" to "Antrag für blaue Ehrenamtskarte"),
            type = Type.Array,
            value = listOf(
                personalData.toJsonField(),
                JsonField(
                    name = "applicationType",
                    translations = mapOf("de" to "Antragstyp"),
                    type = Type.String,
                    value = when (applicationType) {
                        ApplicationType.FIRST_APPLICATION -> "Erstantrag"
                        ApplicationType.RENEWAL_APPLICATION -> "Verlängerungsantrag"
                    }
                ),
                entitlement.toJsonField()
            )
        )
    }
}

enum class ApplicationType {
    FIRST_APPLICATION,
    RENEWAL_APPLICATION
}
