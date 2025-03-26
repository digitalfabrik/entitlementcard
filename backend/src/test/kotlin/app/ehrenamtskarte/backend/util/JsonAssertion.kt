package app.ehrenamtskarte.backend.util

import com.fasterxml.jackson.databind.JsonNode
import kotlin.test.assertEquals

object JsonAssertion {

    /**
     * Asserts that the value of the JSON field matches the expected value
     * and produces a more precise error message tailored for JSON data
     */
    fun <T> assertJsonValue(json: JsonNode, expected: T, key: String) {
        val actualNode = json.findValue(key) ?: throw AssertionError("Key '$key' not found in JSON")

        val actual: Any = when (expected) {
            is Int -> actualNode.numberValue()?.toInt()
                ?: throw AssertionError("Key '$key' is not an Int")
            is Long -> actualNode.numberValue()?.toLong()
                ?: throw AssertionError("Key '$key' is not a Long")
            is Double -> actualNode.numberValue()?.toDouble()
                ?: throw AssertionError("Key '$key' is not a Double")
            is Boolean -> actualNode.booleanValue()
            is String -> actualNode.asText()
            else -> throw IllegalArgumentException("Unsupported type")
        }

        assertEquals(expected, actual, "Assertion failed for JSON key '$key'")
    }
}
