package app.ehrenamtskarte.backend.graphql.freinet.exceptions

import app.ehrenamtskarte.backend.graphql.exceptions.GraphQLBaseException
import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode

class FreinetPersonDataInvalidException : GraphQLBaseException(
    GraphQLExceptionCode.FREINET_PERSON_DATA_INVALID,
)
