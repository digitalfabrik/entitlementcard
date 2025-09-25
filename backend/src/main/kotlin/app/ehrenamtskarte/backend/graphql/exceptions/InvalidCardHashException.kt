package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode

class InvalidCardHashException : GraphQLBaseException(GraphQLExceptionCode.INVALID_CARD_HASH)
