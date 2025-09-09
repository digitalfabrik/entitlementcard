package app.ehrenamtskarte.backend.graphql.freinet.exceptions

import app.ehrenamtskarte.backend.graphql.shared.exceptions.GraphQLBaseException
import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class FreinetFoundMultiplePersonsException : GraphQLBaseException(
    GraphQLExceptionCode.FREINET_FOUND_MULTIPLE_PERSONS,
)
