package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode

class StoreNotFoundException : GraphQLBaseException(GraphQLExceptionCode.STORE_NOT_FOUND)
