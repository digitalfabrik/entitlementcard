package app.ehrenamtskarte.backend.application.webservice.schema.create

import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.EmailInput
import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.ShortTextInput
import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidJsonException

data class OrganizationContact(
    val name: ShortTextInput,
    val telephone: ShortTextInput,
    val email: EmailInput,
    val hasGivenPermission: Boolean
) : JsonFieldSerializable {

    init {
        if (!hasGivenPermission) {
            throw InvalidJsonException("Contact person did not accept data transmission.")
        }
    }

    override fun toJsonField(): JsonField {
        return JsonField(
            "organizationContact",
            Type.Array,
            listOf(
                name.toJsonField("name"),
                telephone.toJsonField("telephone"),
                email.toJsonField("email"),
                JsonField(
                    "hasGivenPermission",
                    Type.Boolean,
                    hasGivenPermission
                )
            )
        )
    }
}
