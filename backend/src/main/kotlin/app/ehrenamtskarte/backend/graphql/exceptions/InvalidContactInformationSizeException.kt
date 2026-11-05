package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode

open class InvalidContactInformationSizeException(maxSize: Int) : GraphQLBaseException(
    GraphQLExceptionCode.INVALID_CONTACT_INFORMATION_SIZE,
    mapOf("maxSize" to maxSize),
)
