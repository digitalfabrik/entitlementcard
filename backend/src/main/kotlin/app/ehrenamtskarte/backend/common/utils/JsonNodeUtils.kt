package app.ehrenamtskarte.backend.common.utils

import com.fasterxml.jackson.databind.JsonNode

fun JsonNode.findValueByName(fieldName: String): String? = findValueByNameNode(fieldName)?.asText()

fun JsonNode.findValueByNameNode(fieldName: String): JsonNode? =
    when {
        this["name"]?.asText() == fieldName -> this["value"]
        this.isArray -> this.firstOrNull { it["name"].asText() == fieldName }?.get("value")
        else -> null
    }

/**
 * Recursively finds a nested node in a structured JSON array
 * Example usage:
 * ```
 * val root = objectMapper.readTree(jsonValue)
 * val personalDataNode = root.findValueByPath("application", "personalData")
 * ```
 */
fun JsonNode.findValueByPath(vararg names: String): JsonNode? =
    names.fold(this as JsonNode?) { node, name ->
        node?.findValueByNameNode(name)
    }
