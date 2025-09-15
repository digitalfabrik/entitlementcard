package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode

class UserEntitlementNotFoundException : GraphQLBaseException(
    GraphQLExceptionCode.USER_ENTITLEMENT_NOT_FOUND,
)
