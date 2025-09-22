package app.ehrenamtskarte.backend.graphql.application.types.primitives

import app.ehrenamtskarte.backend.graphql.application.types.JsonField
import app.ehrenamtskarte.backend.graphql.application.types.Type
import app.ehrenamtskarte.backend.graphql.shared.exceptions.InvalidJsonException
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException

@GraphQLDescription("A local date in the format yyyy-MM-dd")
data class DateInput(val date: String) {
    init {
        try {
            LocalDate.parse(date, DateTimeFormatter.ISO_LOCAL_DATE)
        } catch (e: DateTimeParseException) {
            throw InvalidJsonException("Invalid date format.")
        }
    }

    fun getDate(): LocalDate = LocalDate.parse(date, DateTimeFormatter.ISO_LOCAL_DATE)

    fun toJsonField(fieldName: String): JsonField = JsonField(fieldName, Type.Date, date)
}
