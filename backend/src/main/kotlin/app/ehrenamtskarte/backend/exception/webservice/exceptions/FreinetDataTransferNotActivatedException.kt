package app.ehrenamtskarte.backend.exception.webservice.exceptions

import app.ehrenamtskarte.backend.exception.GraphQLBaseException
import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class FreinetDataTransferNotActivatedException : GraphQLBaseException(
    GraphQLExceptionCode.FREINET_DATA_TRANSFER_NOT_ACTIVATED,
)
