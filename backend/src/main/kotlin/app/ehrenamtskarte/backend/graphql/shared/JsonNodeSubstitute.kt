package app.ehrenamtskarte.backend.graphql.shared

import tools.jackson.databind.JsonNode
import tools.jackson.databind.ObjectMapper
import tools.jackson.databind.node.ArrayNode
import tools.jackson.databind.node.IntNode
import tools.jackson.databind.node.ObjectNode

fun JsonNode.substitute(path: String, value: Int, mapper: ObjectMapper) {
    val paths = path.split(".")
    var node = this

    for (fieldOrIndex in paths.subList(0, paths.size - 1)) {
        node = when (node) {
            is ArrayNode -> node.path(
                fieldOrIndex.toIntOrNull()
                    ?: throw IllegalArgumentException("Expecting array index, but could not convert to integer."),
            )
            is ObjectNode -> node.path(fieldOrIndex)
            else -> throw IllegalStateException("Expected ArrayNode or ObjectNode.")
        }
        if (node.isMissingNode || node.isNull) {
            throw IllegalArgumentException("Accessing unavailable field")
        }
    }

    val lastPath = paths.last()
    val replaceWith = IntNode(value)
    when (node) {
        is ArrayNode -> node[
            lastPath.toIntOrNull()
                ?: throw IllegalArgumentException("Expecting array index, but could not convert to integer."),
        ] =
            replaceWith

        is ObjectNode -> node.set(lastPath, replaceWith)
        else -> throw IllegalStateException("Expected ArrayNode or ObjectNode.")
    }
}
