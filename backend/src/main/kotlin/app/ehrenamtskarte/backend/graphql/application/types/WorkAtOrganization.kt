package app.ehrenamtskarte.backend.graphql.application.types

import app.ehrenamtskarte.backend.graphql.application.types.primitives.Attachment
import app.ehrenamtskarte.backend.graphql.application.types.primitives.DateInput
import app.ehrenamtskarte.backend.graphql.application.types.primitives.ShortTextInput
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidJsonException

enum class CompensationType(val translationKey: String) {
    NONE("compensationTypeNone"),
    VOLUNTEER_ALLOWANCE("compensationTypeVolunteerAllowance"),
    TRAINER_ALLOWANCE("compensationTypeTrainerAllowance"),
}

data class WorkAtOrganization(
    val organization: Organization,
    val amountOfWork: Double,
    val responsibility: ShortTextInput,
    val workSinceDate: DateInput,
    val compensationType: CompensationType,
    val compensationAmount: Double?,
    val certificate: Attachment?,
    val isAlreadyVerified: Boolean?,
) : JsonFieldSerializable {
    init {
        if (compensationType == CompensationType.NONE && compensationAmount != null) {
            throw InvalidJsonException("Compensation amount must not be set if compensation type is NONE.")
        }
        if (compensationType != CompensationType.NONE && compensationAmount == null) {
            throw InvalidJsonException("Compensation amount must be set if compensation type is not NONE.")
        }
        if (compensationAmount != null && compensationAmount < 0) {
            throw InvalidJsonException("Compensation amount must not be negative.")
        }
    }

    override fun toJsonField(): JsonField =
        JsonField(
            "workAtOrganization",
            Type.Array,
            listOfNotNull(
                organization.toJsonField(),
                responsibility.toJsonField("responsibility"),
                JsonField("amountOfWork", Type.Number, amountOfWork),
                workSinceDate.toJsonField("workSinceDate"),
                JsonField("compensationType", Type.TranslatableString, compensationType.translationKey),
                compensationAmount?.let { JsonField("compensationAmount", Type.Number, it) },
                certificate?.toJsonField("certificate"),
                JsonField(
                    "isAlreadyVerified",
                    Type.Boolean,
                    isAlreadyVerified ?: false,
                ),
            ),
        )
}
