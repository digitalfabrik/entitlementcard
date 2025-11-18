package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode

class RegionNotUniqueException : GraphQLBaseException(GraphQLExceptionCode.REGION_NOT_UNIQUE)
