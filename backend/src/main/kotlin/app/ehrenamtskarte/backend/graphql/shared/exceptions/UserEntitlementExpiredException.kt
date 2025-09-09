package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.graphql.shared.schema.GraphQLExceptionCode

class UserEntitlementExpiredException : GraphQLBaseException(
    GraphQLExceptionCode.USER_ENTITLEMENT_EXPIRED,
)
