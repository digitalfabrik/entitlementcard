package app.ehrenamtskarte.backend.application.webservice.schema.create.primitives

import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import app.ehrenamtskarte.backend.exception.webservice.exceptions.EmptyInputException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.TooLongInputException
import com.expediagroup.graphql.generator.annotations.GraphQLDescription

const val MAX_SHORT_TEXT_LENGTH = 300

@GraphQLDescription("A String wrapper that expects a non-empty string with at most $MAX_SHORT_TEXT_LENGTH characters")
data class ShortTextInput(val shortText: String) {
    init {
        if (shortText.isEmpty()) {
            throw EmptyInputException()
        } else if (shortText.length > MAX_SHORT_TEXT_LENGTH) {
            throw TooLongInputException(MAX_SHORT_TEXT_LENGTH)
        }
    }

    fun toJsonField(fieldName: String, translations: Map<String, String>): JsonField {
        return JsonField(fieldName, translations, Type.String, shortText)
    }
}
