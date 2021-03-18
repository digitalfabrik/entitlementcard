package app.ehrenamtskarte.backend.application.webservice.schema.create

import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable

data class GoldenEakCardApplication(
    val personalData: PersonalData,
    val entitlement: GoldenCardEntitlement,
    val hasAcceptedPrivacyPolicy: Boolean,
    val givenInformationIsCorrectAndComplete: Boolean
) : JsonFieldSerializable {
    override fun toJsonField(): JsonField {
        return JsonField(
            "golden-card-application", mapOf("de" to "Antrag auf goldene Ehrenamtskarte"), Type.Array, listOf(
                personalData.toJsonField(),
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
