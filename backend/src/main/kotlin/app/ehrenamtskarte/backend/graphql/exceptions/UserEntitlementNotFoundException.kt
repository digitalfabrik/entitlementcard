package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode

class UserEntitlementNotFoundException : GraphQLBaseException(
    GraphQLExceptionCode.USER_ENTITLEMENT_NOT_FOUND,
)
