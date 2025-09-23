package app.ehrenamtskarte.backend.graphql.freinet.exceptions

import app.ehrenamtskarte.backend.graphql.exceptions.GraphQLBaseException
import app.ehrenamtskarte.backend.graphql.exceptions.GraphQLExceptionCode

class FreinetDataTransferNotPermittedException : GraphQLBaseException(
    GraphQLExceptionCode.FREINET_DATA_TRANSFER_NOT_PERMITTED,
)
