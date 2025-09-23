package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.exceptions.GraphQLExceptionCode

class RegionNotFoundException : GraphQLBaseException(GraphQLExceptionCode.REGION_NOT_FOUND)
