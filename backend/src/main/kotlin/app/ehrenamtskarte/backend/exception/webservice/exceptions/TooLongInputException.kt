package app.ehrenamtskarte.backend.exception.webservice.exceptions

import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode
import graphql.GraphqlErrorException

open class TooLongInputException(val maxChars: Int) : GraphqlErrorException(
    newErrorException().extensions(
        mapOf(
            Pair("code", GraphQLExceptionCode.TOO_LONG_INPUT),
            Pair("maxChars", maxChars)
        )
    )
)
