package app.ehrenamtskarte.backend.graphql.application.types

import app.ehrenamtskarte.backend.graphql.application.types.primitives.Attachment
import app.ehrenamtskarte.backend.graphql.application.types.primitives.ShortTextInput
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidJsonException

data class Organization(
    val name: ShortTextInput,
    val address: Address,
    val contact: OrganizationContact?,
    val category: ShortTextInput,
) : JsonFieldSerializable, ApplicationVerificationsHolder {
    /**
     * An activity at this organization is verified either by the organization contact or by an uploaded certificate.
     */
    fun requireContactOrCertificate(certificate: Attachment?) {
        if ((contact == null) == (certificate == null)) {
            throw InvalidJsonException("Either an organization contact or a certificate must be provided.")
        }
    }

    override fun toJsonField(): JsonField =
        JsonField(
            "organization",
            Type.Array,
            listOfNotNull(
                name.toJsonField("name"),
                address.toJsonField(),
                category.toJsonField("category", true),
                contact?.toJsonField(),
            ),
        )

    override fun extractApplicationVerifications() =
        listOfNotNull(
            contact?.let {
                ExtractedApplicationVerification(
                    contactName = it.name.shortText,
                    contactEmailAddress = it.email.email,
                    organizationName = name.shortText,
                )
            },
        )
}
