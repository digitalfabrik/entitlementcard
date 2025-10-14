package app.ehrenamtskarte.backend.helper

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.treeToValue
import org.junit.jupiter.api.fail
import org.springframework.http.ResponseEntity

val objectMapper = jacksonObjectMapper()

/**
 * Parses the JSON body of a ResponseEntity into a generic JsonNode.
 * Fails the test if the response body is null.
 */
fun ResponseEntity<String>.json(): JsonNode {
    val jsonBody = this.body ?: fail("Response body is null")
    return objectMapper.readTree(jsonBody)
}

/**
 * Extracts and deserializes the data from the first field inside the "data" object of a GraphQL response.
 * This is the standard way to unwrap a GraphQL data response.
 * e.g., for `{"data": {"myQuery": {"foo": "bar"}}}`, it returns the `{"foo": "bar"}` part deserialized to type T.
 */
inline fun <reified T> ResponseEntity<String>.toDataObject(): T {
    val dataNode = this.json().get("data") ?: fail("Response has no 'data' field.")
    val resultNode = dataNode.first() ?: fail("'data' object is empty or null.")
    return objectMapper.treeToValue(resultNode) ?: fail("Failed to convert JSON to ${T::class.simpleName}")
}

/**
 * Extracts the "errors" node from a GraphQL response if it exists
 */
fun ResponseEntity<String>.error(): JsonNode? = this.json().get("errors")?.first()

/**
 * Deserializes the GraphQL error into a structured [GraphQLErrorModel] object.
 * This provides a type-safe way to assert on error properties.
 * Fails the test if the response does not contain a parsable error.
 */
fun ResponseEntity<String>.toErrorObject(): GraphQLErrorModel {
    val errorNode = this.error() ?: fail("Response contains no errors")
    return try {
        objectMapper.treeToValue(errorNode)
    } catch (e: Exception) {
        fail("Failed to deserialize error node to GraphQLErrorModel: ${e.message}. Node was: $errorNode")
    }
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class GraphQLErrorModel(
    val message: String,
    val extensions: GraphQLErrorExtensions?,
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class GraphQLErrorExtensions(
    val classification: String?,
    val code: GraphQLExceptionCode?,
    val reason: String?,
)
