package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class RegionNotActivatedForApplicationException : GraphQLBaseException(
    GraphQLExceptionCode.REGION_NOT_ACTIVATED_FOR_APPLICATION,
)
