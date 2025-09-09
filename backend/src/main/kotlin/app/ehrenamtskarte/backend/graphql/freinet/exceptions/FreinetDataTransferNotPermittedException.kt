package app.ehrenamtskarte.backend.graphql.freinet.exceptions

import app.ehrenamtskarte.backend.exception.GraphQLBaseException
import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class FreinetDataTransferNotPermittedException : GraphQLBaseException(
    GraphQLExceptionCode.FREINET_DATA_TRANSFER_NOT_PERMITTED,
)
