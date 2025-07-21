package app.ehrenamtskarte.backend.common.utils

import com.fasterxml.jackson.databind.ObjectMapper
import io.javalin.http.Context
import io.opentelemetry.api.GlobalOpenTelemetry
import io.opentelemetry.api.trace.StatusCode
import io.opentelemetry.api.trace.Tracer
import io.sentry.Sentry

class GraphQLSentryTracing {
    // TODO set version to current release version
    // Ensure that initialization will be done on first call after sentry was initialized
    private val tracer: Tracer by lazy {
        GlobalOpenTelemetry.getTracer("entitlementcard-backend", "1.0.0")
    }

    private val objectMapper = ObjectMapper()

    fun traceGraphQLRequest(ctx: Context, executeGraphQL: () -> Unit) {
        try {
            val requestBody = ctx.body()
            val graphqlRequest = objectMapper.readTree(requestBody)

            val query = graphqlRequest.get("query")?.asText() ?: ""
            val operationName = graphqlRequest.get("operationName")?.asText()

            val operationType = determineOperationType(query)
            val actualOperationName = operationName ?: extractOperationName(query) ?: "anonymous"

            val span = tracer.spanBuilder("$operationType $actualOperationName")
                .setAttribute("graphql.operation.type", operationType)
                .setAttribute("graphql.operation.name", actualOperationName)
                .setAttribute("graphql.document", query)
                .setAttribute("http.method", ctx.method().toString())
                .setAttribute("http.url", ctx.url())
                .startSpan()

            println("🔄 Creating GraphQL span: ${span.spanContext.spanId}")

            try {
                span.makeCurrent().use {
                    executeGraphQL()
                }
                span.setAttribute("http.status_code", ctx.res().status.toLong())
                span.setStatus(StatusCode.OK)
            } catch (e: Exception) {
                span.recordException(e)
                span.setStatus(StatusCode.ERROR, e.message ?: "GraphQL execution error")

                Sentry.withScope { scope ->
                    scope.setTag("graphql.operation.type", operationType)
                    scope.setTag("graphql.operation.name", actualOperationName)
                    scope.setExtra("graphql.query", query)
                    Sentry.captureException(e)
                }
                throw e
            } finally {
                span.end()
            }
        } catch (parseError: Exception) {
            val span = tracer.spanBuilder("GraphQL Request")
                .setAttribute("graphql.parse.error", parseError.message ?: "Parse error")
                .startSpan()

            try {
                span.makeCurrent().use { executeGraphQL() }
                span.setStatus(StatusCode.OK)
            } catch (e: Exception) {
                span.recordException(e)
                span.setStatus(StatusCode.ERROR)
                throw e
            } finally {
                span.end()
            }
        }
    }

    private fun determineOperationType(query: String): String {
        val normalizedQuery = query.trim().lowercase()
        return when {
            normalizedQuery.startsWith("mutation") -> "MUTATION"
            normalizedQuery.startsWith("subscription") -> "SUBSCRIPTION"
            else -> "QUERY"
        }
    }

    private fun extractOperationName(query: String): String? {
        val operationNameRegex = """(?:query|mutation|subscription)\s+(\w+)""".toRegex(RegexOption.IGNORE_CASE)
        return operationNameRegex.find(query)?.groupValues?.get(1)
    }
}
