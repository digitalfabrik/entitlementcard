package app.ehrenamtskarte.backend.exception.webservice.exceptions

import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode
import graphql.GraphqlErrorException

open class InvalidNoteSizeException(maxSize: Int) : GraphqlErrorException(
    newErrorException().extensions(
        mapOf(
            Pair("code", GraphQLExceptionCode.INVALID_NOTE_SIZE),
            Pair("maxSize", maxSize)
        )
    )
)
