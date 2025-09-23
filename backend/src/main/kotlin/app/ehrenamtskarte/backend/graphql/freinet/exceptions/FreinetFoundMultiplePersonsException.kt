package app.ehrenamtskarte.backend.graphql.freinet.exceptions

import app.ehrenamtskarte.backend.graphql.exceptions.GraphQLBaseException
import app.ehrenamtskarte.backend.graphql.exceptions.GraphQLExceptionCode

class FreinetFoundMultiplePersonsException : GraphQLBaseException(
    GraphQLExceptionCode.FREINET_FOUND_MULTIPLE_PERSONS,
)
