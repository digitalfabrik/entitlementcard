package app.ehrenamtskarte.backend.helper

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import okhttp3.ResponseBody
import kotlin.test.fail

data class GraphqlResponse(
    val code: Int,
    val body: ResponseBody?
) {
    val objectMapper = jacksonObjectMapper()

    fun json(): JsonNode {
        val responseBody = body?.string() ?: fail("Response body is null")
        return objectMapper.readTree(responseBody)
    }

    inline fun <reified T> toDataObject(): T {
        val result = json().get("data").first()
        return objectMapper.treeToValue(result, T::class.java)
    }
}
