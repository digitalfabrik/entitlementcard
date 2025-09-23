package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.exceptions.GraphQLExceptionCode

class RegionNotUniqueException : GraphQLBaseException(GraphQLExceptionCode.REGION_NOT_UNIQUE)
