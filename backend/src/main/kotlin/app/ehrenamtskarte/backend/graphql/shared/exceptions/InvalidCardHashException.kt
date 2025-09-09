package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.graphql.shared.schema.GraphQLExceptionCode

class InvalidCardHashException : GraphQLBaseException(GraphQLExceptionCode.INVALID_CARD_HASH)
