package app.ehrenamtskarte.backend.application.webservice.schema.create.primitives

import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.exceptions.GraphQLKotlinException
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException

@GraphQLDescription("A local date in the format yyyy-MM-dd")
data class DateInput(val date: String) {
    init {
        try {
            LocalDate.parse(date, DateTimeFormatter.ISO_LOCAL_DATE)
        } catch (e: DateTimeParseException) {
            throw GraphQLKotlinException("DateInput must be in the format yyyy-MM-dd.")
        }
    }

    fun toJsonField(fieldName: String, translations: Map<String, String>): JsonField {
        return JsonField(fieldName, translations, Type.Date, date)
    }
}
