package app.ehrenamtskarte.backend.graphql.application.types

import app.ehrenamtskarte.backend.graphql.application.types.primitives.DateInput
import app.ehrenamtskarte.backend.graphql.application.types.primitives.EmailInput
import app.ehrenamtskarte.backend.graphql.application.types.primitives.ShortTextInput
import app.ehrenamtskarte.backend.graphql.shared.exceptions.InvalidJsonException
import java.time.LocalDate
import java.time.ZoneId

data class PersonalData(
    val forenames: ShortTextInput,
    val surname: ShortTextInput,
    val address: Address,
    val dateOfBirth: DateInput,
    val telephone: ShortTextInput?,
    val emailAddress: EmailInput,
) : JsonFieldSerializable {
    init {
        val maximumBirthDate = LocalDate.now(ZoneId.of("Europe/Berlin")).minusYears(16)
        if (maximumBirthDate.isBefore(dateOfBirth.getDate())) {
            throw InvalidJsonException("Date of birth must be at least 16 years ago.")
        }
    }

    override fun toJsonField(): JsonField =
        JsonField(
            "personalData",
            Type.Array,
            listOfNotNull(
                forenames.toJsonField("forenames"),
                surname.toJsonField("surname"),
                address.toJsonField(),
                dateOfBirth.toJsonField("dateOfBirth"),
                telephone?.toJsonField("telephone"),
                emailAddress.toJsonField("emailAddress"),
            ),
        )
}
