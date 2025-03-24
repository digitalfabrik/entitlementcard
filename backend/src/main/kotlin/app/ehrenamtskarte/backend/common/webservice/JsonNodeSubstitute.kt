package app.ehrenamtskarte.backend.common.webservice

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ArrayNode
import com.fasterxml.jackson.databind.node.IntNode
import com.fasterxml.jackson.databind.node.ObjectNode

fun JsonNode.substitute(
    path: String,
    value: Int,
    mapper: ObjectMapper,
) {
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

        is ObjectNode -> node.set<ObjectNode>(lastPath, replaceWith)
        else -> throw IllegalStateException("Expected ArrayNode or ObjectNode.")
    }
}
