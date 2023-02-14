package app.ehrenamtskarte.backend.application.webservice.schema.create.primitives

import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.exceptions.GraphQLKotlinException

@GraphQLDescription("An email address with at most $MAX_SHORT_TEXT_LENGTH characters")
data class EmailInput(val email: String) {
    init {
        if (email.isEmpty()) {
            throw GraphQLKotlinException("Value of EmailInput should not be empty.")
        } else if (email.length > MAX_SHORT_TEXT_LENGTH) {
            throw GraphQLKotlinException("Value of EmailInput should have at most $MAX_SHORT_TEXT_LENGTH characters.")
        }
    }

    fun toJsonField(fieldName: String, translations: Map<String, String>): JsonField {
        return JsonField(fieldName, translations, Type.String, email)
    }
}
