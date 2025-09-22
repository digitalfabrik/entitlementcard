package app.ehrenamtskarte.backend.graphql.application.types

import app.ehrenamtskarte.backend.graphql.application.types.primitives.EmailInput
import app.ehrenamtskarte.backend.graphql.application.types.primitives.ShortTextInput
import app.ehrenamtskarte.backend.graphql.shared.exceptions.InvalidJsonException

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
