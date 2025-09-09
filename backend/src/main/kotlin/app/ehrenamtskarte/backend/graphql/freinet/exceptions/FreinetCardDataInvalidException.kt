package app.ehrenamtskarte.backend.graphql.freinet.exceptions

import app.ehrenamtskarte.backend.exception.GraphQLBaseException
import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class FreinetCardDataInvalidException : GraphQLBaseException(
    GraphQLExceptionCode.FREINET_CARD_DATA_INVALID,
)
