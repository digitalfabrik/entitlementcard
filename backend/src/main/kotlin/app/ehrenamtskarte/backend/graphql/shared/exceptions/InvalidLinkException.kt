package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.graphql.shared.schema.GraphQLExceptionCode

class InvalidLinkException : GraphQLBaseException(GraphQLExceptionCode.INVALID_LINK)
