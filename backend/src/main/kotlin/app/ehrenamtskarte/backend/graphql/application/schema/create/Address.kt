package app.ehrenamtskarte.backend.graphql.application.schema.create

import app.ehrenamtskarte.backend.graphql.application.schema.create.primitives.ShortTextInput
import app.ehrenamtskarte.backend.graphql.application.schema.view.JsonField
import app.ehrenamtskarte.backend.graphql.application.schema.view.Type
import app.ehrenamtskarte.backend.graphql.application.utils.JsonFieldSerializable

data class Address(
    val street: ShortTextInput,
    val houseNumber: ShortTextInput,
    val addressSupplement: ShortTextInput?,
    val postalCode: ShortTextInput,
    val location: ShortTextInput,
    val country: ShortTextInput,
) : JsonFieldSerializable {
    override fun toJsonField(): JsonField =
        JsonField(
            "address",
            Type.Array,
            listOfNotNull(
                street.toJsonField("street"),
                houseNumber.toJsonField("houseNumber"),
                addressSupplement?.toJsonField("addressSupplement"),
                postalCode.toJsonField("postalCode"),
                location.toJsonField("location"),
                country.toJsonField("country"),
            ),
        )
}
