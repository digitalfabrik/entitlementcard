package app.ehrenamtskarte.backend.application.webservice.schema.create

import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.ShortTextInput
import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import app.ehrenamtskarte.backend.application.webservice.utils.ApplicationVerificationsHolder
import app.ehrenamtskarte.backend.application.webservice.utils.ExtractedApplicationVerification
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable

data class Organization(
    val name: ShortTextInput,
    val address: Address,
    val contact: OrganizationContact,
    val category: ShortTextInput
) : JsonFieldSerializable, ApplicationVerificationsHolder {
    override fun toJsonField(): JsonField {
        return JsonField(
            "organization",
            Type.Array,
            listOfNotNull(
                name.toJsonField("name"),
                address.toJsonField(),
                category.toJsonField("category"),
                contact.toJsonField()
            )
        )
    }

    override fun extractApplicationVerifications() = listOf(
        ExtractedApplicationVerification(
            contactName = contact.name.shortText,
            contactEmailAddress = contact.email.email,
            organizationName = name.shortText
        )
    )
}
