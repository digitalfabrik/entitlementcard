package app.ehrenamtskarte.backend.application.webservice.schema.create

import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.Attachment
import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.DateInput
import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.ShortTextInput
import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable

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
