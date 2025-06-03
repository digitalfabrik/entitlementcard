package app.ehrenamtskarte.backend.common.utils

import com.fasterxml.jackson.databind.JsonNode

fun JsonNode.findValueByName(fieldName: String): String? =
    this.firstOrNull { it["name"].asText() == fieldName }
        ?.get("value")
        ?.asText()

fun JsonNode.findValueByNameNode(fieldName: String): JsonNode? =
    this.firstOrNull { it["name"].asText() == fieldName }
        ?.get("value")
