package app.ehrenamtskarte.backend.application.webservice.schema.create

import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable

data class OrganizationContact(
    val name: String,
    val telephone: String,
    val email: String,
    val hasGivenPermission: Boolean
) : JsonFieldSerializable {
    override fun toJsonField(): JsonField {
        return JsonField(
            "orgnaizationContact", mapOf("de" to "Kontaktperson der Organisation"), Type.Array, listOf(
                JsonField("name", mapOf("de" to "Name"), Type.String, name),
                JsonField("telephone", mapOf("de" to "Telefonnummer"), Type.String, telephone),
                JsonField("email", mapOf("de" to "Email-Adresse"), Type.String, email),
                JsonField(
                    "hasGivenPermission",
                    mapOf("de" to "Kontaktperson hat zur Weitergabe der Daten möglicher Kontaktaufnahme eingewilligt"),
                    Type.String,
                    if (hasGivenPermission) "Ja" else "Nein"
                )
            )
        )
    }

}
