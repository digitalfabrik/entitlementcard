package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.exceptions.GraphQLExceptionCode

class RegionNotActivatedForApplicationException : GraphQLBaseException(
    GraphQLExceptionCode.REGION_NOT_ACTIVATED_FOR_APPLICATION,
)
