package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode

class InvalidCardHashException : GraphQLBaseException(GraphQLExceptionCode.INVALID_CARD_HASH)
