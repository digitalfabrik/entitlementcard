package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class InvalidLinkException : GraphQLBaseException(GraphQLExceptionCode.INVALID_LINK)
