package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class RegionNotUniqueException : GraphQLBaseException(GraphQLExceptionCode.REGION_NOT_UNIQUE)
