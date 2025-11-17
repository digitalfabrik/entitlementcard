package app.ehrenamtskarte.backend.graphql.application.types.primitives

import app.ehrenamtskarte.backend.graphql.application.types.JsonField
import app.ehrenamtskarte.backend.graphql.application.types.Type
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidJsonException
import com.expediagroup.graphql.generator.annotations.GraphQLDescription

const val MAX_SHORT_TEXT_LENGTH = 300

@GraphQLDescription(
    "A String wrapper that expects a non-empty string with at most $MAX_SHORT_TEXT_LENGTH characters",
)
data class ShortTextInput(val shortText: String) {
    init {
        if (shortText.isEmpty()) {
            throw InvalidJsonException("Value of ShortTextInput should not be empty.")
        } else if (shortText.length > MAX_SHORT_TEXT_LENGTH) {
            throw InvalidJsonException(
                "Value of ShortTextInput should have at most $MAX_SHORT_TEXT_LENGTH characters.",
            )
        }
    }

    fun toJsonField(fieldName: String, translatable: Boolean = false): JsonField {
        if (translatable) {
            return JsonField(fieldName, Type.TranslatableString, shortText)
        }
        return JsonField(fieldName, Type.String, shortText)
    }
}
