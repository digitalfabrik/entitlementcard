package app.ehrenamtskarte.backend.graphql.freinet.exceptions

import app.ehrenamtskarte.backend.graphql.shared.exceptions.GraphQLBaseException
import app.ehrenamtskarte.backend.graphql.shared.schema.GraphQLExceptionCode

class FreinetCardDataInvalidException : GraphQLBaseException(
    GraphQLExceptionCode.FREINET_CARD_DATA_INVALID,
)
