package app.ehrenamtskarte.backend.application.webservice.schema.create

import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable

data class PersonalData(
    val title: String?,
    val forenames: String,
    val surname: String,
    val dateOfBirth: String,
    val telephone: String?,
    val address: Address,
    val emailAddress: String,
    val nationality: String?,
    val gender: String?
) : JsonFieldSerializable {
    override fun toJsonField(): JsonField {
        return JsonField(
            "personalData", mapOf("de" to "Persönliche Daten"), Type.Array, listOfNotNull(
                if (title != null) JsonField("title", mapOf("de" to "Titel"), Type.String, title) else null,
                JsonField("forenames", mapOf("de" to "Vorname(n)"), Type.String, forenames),
                JsonField("surname", mapOf("de" to "Nachname(n)"), Type.String, surname),
                JsonField("dateOfBirth", mapOf("de" to "Geburtsdatum"), Type.String, dateOfBirth),
                address.toJsonField(),
                if (telephone != null)
                    JsonField("telephone", mapOf("de" to "Telefonnummer"), Type.String, telephone) else null,
                JsonField("emailAddress", mapOf("de" to "Email-Adresse"), Type.String, emailAddress),
                if (nationality != null)
                    JsonField("nationality", mapOf("de" to "Nationalität"), Type.String, nationality) else null,
                if (gender != null) JsonField("gender", mapOf("de" to "Geschlecht"), Type.String, gender) else null
            )
        )
    }
}
