package app.ehrenamtskarte.backend.common.webservice

import app.ehrenamtskarte.backend.exception.GraphQLBaseException
import graphql.ExceptionWhileDataFetching
import graphql.execution.DataFetcherExceptionHandler
import graphql.execution.DataFetcherExceptionHandlerParameters
import graphql.execution.DataFetcherExceptionHandlerResult
import java.lang.reflect.InvocationTargetException
import java.util.concurrent.CompletableFuture
import java.util.concurrent.CompletionException

class CustomDataFetcherExceptionHandler : DataFetcherExceptionHandler {
    override fun handleException(
        handlerParameters: DataFetcherExceptionHandlerParameters,
    ): CompletableFuture<DataFetcherExceptionHandlerResult> {
        val error = when (val exception = handlerParameters.exception.unwrap()) {
            is GraphQLBaseException -> exception.toError(
                handlerParameters.path,
                handlerParameters.sourceLocation,
            )
            else -> ExceptionWhileDataFetching(
                handlerParameters.path,
                exception,
                handlerParameters.sourceLocation,
            )
        }
        return CompletableFuture.completedFuture(
            DataFetcherExceptionHandlerResult.newResult().error(error).build(),
        )
    }

    private fun Throwable.unwrap(): Throwable =
        cause?.takeIf {
            this is CompletionException || this is InvocationTargetException
        } ?: this
}
