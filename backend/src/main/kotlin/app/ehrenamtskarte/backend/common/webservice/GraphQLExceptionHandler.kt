package app.ehrenamtskarte.backend.common.webservice

import graphql.ExceptionWhileDataFetching
import graphql.execution.SimpleDataFetcherExceptionHandler
import org.slf4j.LoggerFactory

class GraphQLExceptionHandler() : SimpleDataFetcherExceptionHandler() {

    override fun logException(error: ExceptionWhileDataFetching, exception: Throwable) {
        val logger = LoggerFactory.getLogger(GraphQLExceptionHandler::class.java)

        // do not log stack trace as these should all be expected errors
        logger.error(error.message)
    }
}
