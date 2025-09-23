package app.ehrenamtskarte.backend.graphql.freinet.exceptions

import app.ehrenamtskarte.backend.graphql.exceptions.GraphQLBaseException
import app.ehrenamtskarte.backend.graphql.exceptions.GraphQLExceptionCode

class FreinetCardDataInvalidException : GraphQLBaseException(
    GraphQLExceptionCode.FREINET_CARD_DATA_INVALID,
)
