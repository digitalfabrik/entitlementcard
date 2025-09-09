package app.ehrenamtskarte.backend.graphql.freinet.exceptions

import app.ehrenamtskarte.backend.graphql.shared.exceptions.GraphQLBaseException
import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class FreinetPersonDataInvalidException : GraphQLBaseException(
    GraphQLExceptionCode.FREINET_PERSON_DATA_INVALID,
)
