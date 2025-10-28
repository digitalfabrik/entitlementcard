package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode

class NotImplementedException(message: String) :
    GraphQLBaseException(GraphQLExceptionCode.NOT_IMPLEMENTED, message = message)
