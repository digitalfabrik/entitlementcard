package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode
import graphql.ErrorType
import graphql.GraphQLError
import graphql.execution.ResultPath
import graphql.language.SourceLocation

open class GraphQLBaseException(
    val code: GraphQLExceptionCode,
    extraExtensions: Map<String, Any> = emptyMap(),
    private val errorType: ErrorType = ErrorType.DataFetchingException,
) : Exception() {
    override val message: String? = "Exception for GraphQL error $code was thrown."
    private val extensions: Map<String, Any> = extraExtensions.plus("code" to code)

    fun toError(path: ResultPath? = null, location: SourceLocation? = null): GraphQLError =
        GraphQLError.newError()
            .errorType(errorType)
            .message("Error $code occurred.")
            .extensions(extensions)
            .path(path)
            .location(location)
            .build()
}
