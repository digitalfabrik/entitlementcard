package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.graphql.shared.schema.GraphQLExceptionCode

class EmailAlreadyExistsException : GraphQLBaseException(GraphQLExceptionCode.EMAIL_ALREADY_EXISTS)
