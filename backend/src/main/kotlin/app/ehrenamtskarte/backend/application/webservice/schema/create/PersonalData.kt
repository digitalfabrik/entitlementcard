package app.ehrenamtskarte.backend.application.webservice.schema.create

import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.DateInput
import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.EmailInput
import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.ShortTextInput
import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable

data class PersonalData(
    val title: ShortTextInput?,
    val forenames: ShortTextInput,
    val surname: ShortTextInput,
    val dateOfBirth: DateInput,
    val telephone: ShortTextInput?,
    val address: Address,
    val emailAddress: EmailInput,
    val nationality: ShortTextInput?,
    val gender: ShortTextInput?
) : JsonFieldSerializable {
    override fun toJsonField(): JsonField {
        return JsonField(
            "personalData",
            mapOf("de" to "Persönliche Daten"),
            Type.Array,
            listOfNotNull(
                title?.toJsonField("title", mapOf("de" to "Titel")),
                forenames.toJsonField("forenames", mapOf("de" to "Vorname(n)")),
                surname.toJsonField("surname", mapOf("de" to "Nachname")),
                dateOfBirth.toJsonField("dateOfBirth", mapOf("de" to "Geburtsdatum")),
                address.toJsonField(),
                telephone?.toJsonField("telephone", mapOf("de" to "Telefonnummer")),
                emailAddress.toJsonField("emailAddress", mapOf("de" to "Email-Adresse")),
                nationality?.toJsonField("nationality", mapOf("de" to "Nationalität")),
                gender?.toJsonField("gender", mapOf("de" to "Geschlecht"))
            )
        )
    }
}
