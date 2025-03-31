package app.ehrenamtskarte.backend.exception.webservice.exceptions

import app.ehrenamtskarte.backend.exception.GraphQLBaseException
import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class UserEntitlementNotFoundException : GraphQLBaseException(
    GraphQLExceptionCode.USER_ENTITLEMENT_NOT_FOUND,
)
