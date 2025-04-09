package app.ehrenamtskarte.backend.exception.webservice.exceptions

import app.ehrenamtskarte.backend.exception.GraphQLBaseException
import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

open class InvalidDataPolicySizeException(maxSize: Int) : GraphQLBaseException(
    GraphQLExceptionCode.INVALID_DATA_POLICY_SIZE,
    mapOf("maxSize" to maxSize),
)
