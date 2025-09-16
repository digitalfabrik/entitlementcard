package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode

class RegionNotActivatedForApplicationException : GraphQLBaseException(
    GraphQLExceptionCode.REGION_NOT_ACTIVATED_FOR_APPLICATION,
)
