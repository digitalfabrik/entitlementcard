package app.ehrenamtskarte.backend.graphql.application.schema.create

import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidJsonException
import app.ehrenamtskarte.backend.graphql.application.schema.create.primitives.EmailInput
import app.ehrenamtskarte.backend.graphql.application.schema.create.primitives.ShortTextInput
import app.ehrenamtskarte.backend.graphql.application.schema.view.JsonField
import app.ehrenamtskarte.backend.graphql.application.schema.view.Type
import app.ehrenamtskarte.backend.graphql.application.utils.JsonFieldSerializable

data class OrganizationContact(
    val name: ShortTextInput,
    val telephone: ShortTextInput,
    val email: EmailInput,
    val hasGivenPermission: Boolean,
) : JsonFieldSerializable {
    init {
        if (!hasGivenPermission) {
            throw InvalidJsonException("Contact person did not accept data transmission.")
        }
    }

    override fun toJsonField(): JsonField =
        JsonField(
            "organizationContact",
            Type.Array,
            listOf(
                name.toJsonField("name"),
                telephone.toJsonField("telephone"),
                email.toJsonField("email"),
                JsonField(
                    "hasGivenPermission",
                    Type.Boolean,
                    hasGivenPermission,
                ),
            ),
        )
}
