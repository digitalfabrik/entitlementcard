package app.ehrenamtskarte.backend.graphql.freinet.types

import com.fasterxml.jackson.databind.JsonNode

data class FreinetPersonCreationResultModel(
    val result: Boolean,
    val data: JsonNode,
)
