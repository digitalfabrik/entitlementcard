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
            translations = mapOf("de" to "Antrag auf blaue Ehrenamtskarte"),
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
                entitlement.toJsonField(),
                JsonField(
                    "hasAcceptedPrivacyPolicy",
                    mapOf("de" to "Ich habe die Richtlinien zum Datenschutz gelesen und akzeptiert"),
                    Type.String,
                    if (hasAcceptedPrivacyPolicy) "Ja" else "Nein"
                ),
                JsonField(
                    "givenInformationIsCorrectAndComplete",
                    mapOf("de" to "Ich bestätige, dass die gegebenen Informationen korrekt und vollständig sind"),
                    Type.String,
                    if (givenInformationIsCorrectAndComplete) "Ja" else "Nein"
                )
            )
        )
    }
}

enum class ApplicationType {
    FIRST_APPLICATION,
    RENEWAL_APPLICATION
}
