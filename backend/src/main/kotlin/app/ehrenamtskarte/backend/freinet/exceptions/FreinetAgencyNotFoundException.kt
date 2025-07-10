package app.ehrenamtskarte.backend.freinet.exceptions

import app.ehrenamtskarte.backend.exception.GraphQLBaseException
import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class FreinetAgencyNotFoundException : GraphQLBaseException(
    GraphQLExceptionCode.FREINET_AGENCY_NOT_FOUND,
)
