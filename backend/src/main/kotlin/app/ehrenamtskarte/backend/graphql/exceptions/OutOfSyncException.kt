package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode

class OutOfSyncException : GraphQLBaseException(
    GraphQLExceptionCode.OUT_OF_SYNC,
)
