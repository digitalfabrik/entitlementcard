package app.ehrenamtskarte.backend.graphql.application.schema.create.primitives

import app.ehrenamtskarte.backend.graphql.application.schema.view.JsonField
import app.ehrenamtskarte.backend.graphql.application.schema.view.Type
import app.ehrenamtskarte.backend.graphql.shared.exceptions.InvalidJsonException
import com.expediagroup.graphql.generator.annotations.GraphQLDescription

@GraphQLDescription("An email address with at most $MAX_SHORT_TEXT_LENGTH characters")
data class EmailInput(val email: String) {
    init {
        if (email.isEmpty()) {
            throw InvalidJsonException("Value of EmailInput should not be empty.")
        } else if (email.length > MAX_SHORT_TEXT_LENGTH) {
            throw InvalidJsonException(
                "Value of EmailInput should have at most $MAX_SHORT_TEXT_LENGTH characters.",
            )
        }
    }

    fun toJsonField(fieldName: String): JsonField = JsonField(fieldName, Type.String, email)
}
