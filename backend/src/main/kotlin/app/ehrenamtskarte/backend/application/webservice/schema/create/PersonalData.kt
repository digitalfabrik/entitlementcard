package app.ehrenamtskarte.backend.application.webservice.schema.create

import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.DateInput
import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.EmailInput
import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.ShortTextInput
import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable

data class PersonalData(
    val forenames: ShortTextInput,
    val surname: ShortTextInput,
    val address: Address,
    val dateOfBirth: DateInput,
    val telephone: ShortTextInput,
    val emailAddress: EmailInput
) : JsonFieldSerializable {
    override fun toJsonField(): JsonField {
        return JsonField(
            "personalData",
            mapOf("de" to "Persönliche Daten"),
            Type.Array,
            listOfNotNull(
                forenames.toJsonField("forenames", mapOf("de" to "Vorname(n)")),
                surname.toJsonField("surname", mapOf("de" to "Nachname")),
                address.toJsonField(),
                dateOfBirth.toJsonField("dateOfBirth", mapOf("de" to "Geburtsdatum")),
                telephone.toJsonField("telephone", mapOf("de" to "Telefonnummer")),
                emailAddress.toJsonField("emailAddress", mapOf("de" to "Email-Adresse"))
            )
        )
    }
}
