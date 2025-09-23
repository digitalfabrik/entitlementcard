package app.ehrenamtskarte.backend.graphql.freinet.exceptions

import app.ehrenamtskarte.backend.graphql.exceptions.GraphQLBaseException
import app.ehrenamtskarte.backend.graphql.exceptions.GraphQLExceptionCode

class FreinetAgencyNotFoundException : GraphQLBaseException(
    GraphQLExceptionCode.FREINET_AGENCY_NOT_FOUND,
)
