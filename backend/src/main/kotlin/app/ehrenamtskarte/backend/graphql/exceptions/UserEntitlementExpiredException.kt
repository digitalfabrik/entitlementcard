package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.exceptions.GraphQLExceptionCode

class UserEntitlementExpiredException : GraphQLBaseException(
    GraphQLExceptionCode.USER_ENTITLEMENT_EXPIRED,
)
