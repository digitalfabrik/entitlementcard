package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode

class StoreAlreadyExistsException : GraphQLBaseException(GraphQLExceptionCode.STORE_ALREADY_EXISTS)
