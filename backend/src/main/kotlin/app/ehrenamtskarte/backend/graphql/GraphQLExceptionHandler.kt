package app.ehrenamtskarte.backend.graphql

import app.ehrenamtskarte.backend.graphql.exceptions.GraphQLBaseException
import app.ehrenamtskarte.backend.shared.exceptions.ForbiddenException
import app.ehrenamtskarte.backend.shared.exceptions.ProjectNotFoundException
import app.ehrenamtskarte.backend.shared.exceptions.UnauthorizedException
import graphql.GraphQLError
import graphql.schema.DataFetchingEnvironment
import org.slf4j.LoggerFactory
import org.springframework.graphql.data.method.annotation.GraphQlExceptionHandler
import org.springframework.graphql.execution.ErrorType
import org.springframework.web.bind.annotation.ControllerAdvice

@ControllerAdvice
class GraphQLExceptionHandler {
    private val logger = LoggerFactory.getLogger(GraphQLExceptionHandler::class.java)

    @GraphQlExceptionHandler
    fun handleGraphQLException(ex: Exception, env: DataFetchingEnvironment): GraphQLError =
        when (ex) {
            is GraphQLBaseException -> {
                ex.toError(env.executionStepInfo.path, env.field.sourceLocation)
            }
            is ProjectNotFoundException -> buildError(env, ErrorType.NOT_FOUND, ex.message)
            is UnauthorizedException -> buildError(env, ErrorType.UNAUTHORIZED, ex.message)
            is ForbiddenException -> buildError(env, ErrorType.FORBIDDEN, ex.message)
            is IllegalArgumentException -> buildError(env, ErrorType.BAD_REQUEST, "Invalid argument: ${ex.message}")
            else -> {
                logger.error("Unexpected GraphQL error on field '${env.field.name}'", ex)
                buildError(env, ErrorType.INTERNAL_ERROR, "An internal server error occurred.")
            }
        }

    private fun buildError(env: DataFetchingEnvironment, errorType: ErrorType, message: String?): GraphQLError {
        val finalMessage = message ?: "An error occurred."
        return GraphQLError.newError()
            .errorType(errorType)
            .message(finalMessage)
            .path(env.executionStepInfo.path)
            .location(env.field.sourceLocation)
            .build()
    }
}
