package app.ehrenamtskarte.backend.graphql

import app.ehrenamtskarte.backend.graphql.exceptions.GraphQLBaseException
import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode
import app.ehrenamtskarte.backend.shared.exceptions.ForbiddenException
import app.ehrenamtskarte.backend.shared.exceptions.UnauthorizedException
import graphql.ExceptionWhileDataFetching
import graphql.GraphQLError
import graphql.schema.DataFetchingEnvironment
import org.slf4j.LoggerFactory
import org.springframework.beans.BeanInstantiationException
import org.springframework.graphql.data.method.annotation.GraphQlExceptionHandler
import org.springframework.web.bind.annotation.ControllerAdvice
import java.util.concurrent.CompletionException

@ControllerAdvice
class GraphQLExceptionHandler {
    private val logger = LoggerFactory.getLogger(GraphQLExceptionHandler::class.java)

    @GraphQlExceptionHandler
    fun handleGraphQLException(ex: Exception, env: DataFetchingEnvironment): GraphQLError {
        val unwrapped = ex.unwrap()
        return when (unwrapped) {
            is GraphQLBaseException -> unwrapped.toGraphQLError(env)
            is UnauthorizedException -> GraphQLBaseException(GraphQLExceptionCode.UNAUTHORIZED).toGraphQLError(env)
            is ForbiddenException -> GraphQLBaseException(GraphQLExceptionCode.FORBIDDEN).toGraphQLError(env)
            else -> {
                logger.error("Unexpected GraphQL error on field '${env.field.name}'", unwrapped)
                ExceptionWhileDataFetching(env.executionStepInfo.path, unwrapped, env.field.sourceLocation)
            }
        }
    }

    private fun Throwable.unwrap(): Throwable =
        when (this) {
            is CompletionException -> cause ?: this
            is BeanInstantiationException -> (cause as? GraphQLBaseException) ?: this
            else -> this
        }
}
