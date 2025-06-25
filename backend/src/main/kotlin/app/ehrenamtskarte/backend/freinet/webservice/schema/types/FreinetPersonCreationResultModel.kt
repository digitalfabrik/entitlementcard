package app.ehrenamtskarte.backend.freinet.webservice.schema.types

import com.fasterxml.jackson.databind.JsonNode

data class FreinetPersonCreationResultModel(
    val result: Boolean,
    val data: JsonNode,
)
