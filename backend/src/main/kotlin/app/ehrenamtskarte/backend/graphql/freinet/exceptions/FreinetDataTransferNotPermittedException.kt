package app.ehrenamtskarte.backend.graphql.freinet.exceptions

import app.ehrenamtskarte.backend.graphql.shared.exceptions.GraphQLBaseException
import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode

class FreinetDataTransferNotPermittedException : GraphQLBaseException(
    GraphQLExceptionCode.FREINET_DATA_TRANSFER_NOT_PERMITTED,
)
