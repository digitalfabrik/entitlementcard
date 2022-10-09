package app.ehrenamtskarte.backend.application.webservice.schema.create

import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable

data class Address(
    val street: String,
    val houseNumber: String,
    val addressSupplement: String?,
    val postalCode: String,
    val location: String
) : JsonFieldSerializable {
    override fun toJsonField(): JsonField {
        return JsonField(
            "address", mapOf("de" to "Adresse"), Type.Array,
            listOfNotNull(
                JsonField("street", mapOf("de" to "Straße"), Type.String, street),
                JsonField("houseNumber", mapOf("de" to "Hausnummer"), Type.String, houseNumber),
                if (addressSupplement != null)
                    JsonField("addressSupplement", mapOf("de" to "Adresszusatz"), Type.String, addressSupplement)
                else null,
                JsonField("postalCode", mapOf("de" to "Postleitzahl"), Type.String, postalCode),
                JsonField("location", mapOf("de" to "Ort"), Type.String, location)
            )
        )
    }
}
