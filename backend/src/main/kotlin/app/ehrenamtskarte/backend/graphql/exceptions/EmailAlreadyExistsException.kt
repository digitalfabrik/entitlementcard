package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode

class EmailAlreadyExistsException : GraphQLBaseException(GraphQLExceptionCode.EMAIL_ALREADY_EXISTS)
