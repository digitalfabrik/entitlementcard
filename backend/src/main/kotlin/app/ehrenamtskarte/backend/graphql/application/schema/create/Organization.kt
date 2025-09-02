package app.ehrenamtskarte.backend.graphql.application.schema.create

import app.ehrenamtskarte.backend.graphql.application.schema.create.primitives.ShortTextInput
import app.ehrenamtskarte.backend.graphql.application.schema.view.JsonField
import app.ehrenamtskarte.backend.graphql.application.schema.view.Type
import app.ehrenamtskarte.backend.graphql.application.utils.ApplicationVerificationsHolder
import app.ehrenamtskarte.backend.graphql.application.utils.ExtractedApplicationVerification
import app.ehrenamtskarte.backend.graphql.application.utils.JsonFieldSerializable

data class Organization(
    val name: ShortTextInput,
    val address: Address,
    val contact: OrganizationContact,
    val category: ShortTextInput,
) : JsonFieldSerializable, ApplicationVerificationsHolder {
    override fun toJsonField(): JsonField =
        JsonField(
            "organization",
            Type.Array,
            listOfNotNull(
                name.toJsonField("name"),
                address.toJsonField(),
                category.toJsonField("category", true),
                contact.toJsonField(),
            ),
        )

    override fun extractApplicationVerifications() =
        listOf(
            ExtractedApplicationVerification(
                contactName = contact.name.shortText,
                contactEmailAddress = contact.email.email,
                organizationName = name.shortText,
            ),
        )
}
