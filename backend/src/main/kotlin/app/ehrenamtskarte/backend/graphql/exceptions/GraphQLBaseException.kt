package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode
import graphql.ErrorType
import graphql.GraphQLError
import graphql.execution.ResultPath
import graphql.language.SourceLocation

open class GraphQLBaseException(
    val code: GraphQLExceptionCode,
    val extraExtensions: Map<String, Any> = emptyMap(),
    val errorType: ErrorType = ErrorType.DataFetchingException,
    override val message: String = "Error $code occurred.",
) : RuntimeException(message) {
    val extensions: Map<String, Any> = buildMap {
        put("code", code)
        putAll(extraExtensions)
    }

    fun toGraphQLError(path: ResultPath? = null, location: SourceLocation? = null): GraphQLError =
        GraphQLError.newError()
            .errorType(errorType)
            .message(message)
            .extensions(extensions)
            .apply {
                path?.let { path(it) }
                location?.let { location(it) }
            }
            .build()
}
