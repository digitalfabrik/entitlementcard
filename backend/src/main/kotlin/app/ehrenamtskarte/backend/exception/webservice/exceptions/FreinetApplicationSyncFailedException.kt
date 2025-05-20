package app.ehrenamtskarte.backend.exception.webservice.exceptions

import app.ehrenamtskarte.backend.exception.GraphQLBaseException
import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class FreinetApplicationSyncFailedException : GraphQLBaseException(
    GraphQLExceptionCode.FREINET_APPLICATION_SYNC_FAILED,
)
