package app.ehrenamtskarte.backend.common.webservice

import app.ehrenamtskarte.backend.exception.GraphQLBaseException
import graphql.ExceptionWhileDataFetching
import graphql.execution.DataFetcherExceptionHandler
import graphql.execution.DataFetcherExceptionHandlerParameters
import graphql.execution.DataFetcherExceptionHandlerResult
import java.util.concurrent.CompletableFuture
import java.util.concurrent.CompletionException

class CustomDataFetcherExceptionHandler : DataFetcherExceptionHandler {
    @Deprecated("Deprecated in graphql-java in favor of handleException.")
    override fun onException(handlerParameters: DataFetcherExceptionHandlerParameters): DataFetcherExceptionHandlerResult {
        val exception = this.unwrapIfCompletionException(handlerParameters.exception)
        if (exception is GraphQLBaseException) {
            val error = exception.toError(handlerParameters.path, handlerParameters.sourceLocation)
            return DataFetcherExceptionHandlerResult.newResult().error(error).build()
        }
        val error = ExceptionWhileDataFetching(handlerParameters.path, exception, handlerParameters.sourceLocation)
        return DataFetcherExceptionHandlerResult.newResult().error(error).build()
    }

    override fun handleException(handlerParameters: DataFetcherExceptionHandlerParameters): CompletableFuture<DataFetcherExceptionHandlerResult> {
        return CompletableFuture.completedFuture(this.onException(handlerParameters))
    }

    private fun unwrapIfCompletionException(exception: Throwable): Throwable? {
        return if (exception.cause != null && exception is CompletionException) exception.cause else exception
    }
}
