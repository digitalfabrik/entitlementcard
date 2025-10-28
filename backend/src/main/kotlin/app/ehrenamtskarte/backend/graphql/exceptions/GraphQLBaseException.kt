package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode
import graphql.ErrorType
import graphql.GraphQLError
import graphql.schema.DataFetchingEnvironment
import java.lang.RuntimeException

open class GraphQLBaseException(
    val code: GraphQLExceptionCode,
    val extraExtensions: Map<String, Any> = emptyMap(),
    val errorType: ErrorType = ErrorType.DataFetchingException,
    override val message: String = "Error $code occurred.",
) : RuntimeException() {
    val extensions: Map<String, Any> = buildMap {
        put("code", code)
        putAll(extraExtensions)
    }

    fun toGraphQLError(env: DataFetchingEnvironment? = null): GraphQLError =
        GraphQLError.newError()
            .errorType(errorType)
            .message(message)
            .extensions(extensions)
            .path(env?.executionStepInfo?.path)
            .location(env?.field?.sourceLocation)
            .build()
}
