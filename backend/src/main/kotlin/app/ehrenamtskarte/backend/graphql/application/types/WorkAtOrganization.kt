package app.ehrenamtskarte.backend.graphql.application.types

import app.ehrenamtskarte.backend.graphql.application.types.primitives.Attachment
import app.ehrenamtskarte.backend.graphql.application.types.primitives.DateInput
import app.ehrenamtskarte.backend.graphql.application.types.primitives.ShortTextInput

data class WorkAtOrganization(
    val organization: Organization,
    val amountOfWork: Double,
    val responsibility: ShortTextInput,
    val workSinceDate: DateInput,
    val payment: Boolean,
    val certificate: Attachment?,
    val isAlreadyVerified: Boolean?,
) : JsonFieldSerializable {
    override fun toJsonField(): JsonField =
        JsonField(
            "workAtOrganization",
            Type.Array,
            listOfNotNull(
                organization.toJsonField(),
                responsibility.toJsonField("responsibility"),
                JsonField("amountOfWork", Type.Number, amountOfWork),
                workSinceDate.toJsonField("workSinceDate"),
                JsonField(
                    "payment",
                    Type.Boolean,
                    payment,
                ),
                certificate?.toJsonField("certificate"),
                JsonField(
                    "isAlreadyVerified",
                    Type.Boolean,
                    isAlreadyVerified ?: false,
                ),
            ),
        )
}
