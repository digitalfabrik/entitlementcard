package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode

class InvalidLinkException : GraphQLBaseException(GraphQLExceptionCode.INVALID_LINK)
