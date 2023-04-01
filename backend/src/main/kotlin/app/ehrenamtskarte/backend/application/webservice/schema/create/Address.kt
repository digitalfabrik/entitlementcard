package app.ehrenamtskarte.backend.application.webservice.schema.create

import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.ShortTextInput
import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable

data class Address(
    val street: ShortTextInput,
    val houseNumber: ShortTextInput,
    val addressSupplement: ShortTextInput?,
    val postalCode: ShortTextInput,
    val location: ShortTextInput,
    val country: ShortTextInput
) : JsonFieldSerializable {
    override fun toJsonField(): JsonField {
        return JsonField(
            "address",
            mapOf("de" to "Adresse"),
            Type.Array,
            listOfNotNull(
                street.toJsonField("street", mapOf("de" to "Straße")),
                houseNumber.toJsonField("houseNumber", mapOf("de" to "Hausnummer")),
                addressSupplement?.toJsonField("addressSupplement", mapOf("de" to "Adresszusatz")),
                postalCode.toJsonField("postalCode", mapOf("de" to "Postleitzahl")),
                location.toJsonField("location", mapOf("de" to "Ort")),
                country.toJsonField("country", mapOf("de" to "Land"))
            )
        )
    }
}
