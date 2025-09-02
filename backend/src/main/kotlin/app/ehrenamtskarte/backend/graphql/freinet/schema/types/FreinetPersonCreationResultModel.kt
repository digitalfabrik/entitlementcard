package app.ehrenamtskarte.backend.graphql.freinet.schema.types

import com.fasterxml.jackson.databind.JsonNode

data class FreinetPersonCreationResultModel(
    val result: Boolean,
    val data: JsonNode,
)
