package app.ehrenamtskarte.backend.graphql.application.types

import com.expediagroup.graphql.generator.annotations.GraphQLIgnore

interface JsonFieldSerializable {
    @GraphQLIgnore
    fun toJsonField(): JsonField
}
