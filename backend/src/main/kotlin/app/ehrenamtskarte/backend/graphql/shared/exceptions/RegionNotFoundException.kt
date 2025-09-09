package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.graphql.shared.schema.GraphQLExceptionCode

class RegionNotFoundException : GraphQLBaseException(GraphQLExceptionCode.REGION_NOT_FOUND)
