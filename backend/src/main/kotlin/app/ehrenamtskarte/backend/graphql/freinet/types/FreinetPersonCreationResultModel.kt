package app.ehrenamtskarte.backend.graphql.freinet.types

import tools.jackson.databind.JsonNode

data class FreinetPersonCreationResultModel(
    val result: Boolean,
    val data: JsonNode,
)
