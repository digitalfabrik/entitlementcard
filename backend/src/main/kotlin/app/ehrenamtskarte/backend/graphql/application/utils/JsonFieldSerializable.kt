package app.ehrenamtskarte.backend.graphql.application.utils

import app.ehrenamtskarte.backend.graphql.application.schema.view.JsonField
import com.expediagroup.graphql.generator.annotations.GraphQLIgnore

interface JsonFieldSerializable {
    @GraphQLIgnore
    fun toJsonField(): JsonField
}
