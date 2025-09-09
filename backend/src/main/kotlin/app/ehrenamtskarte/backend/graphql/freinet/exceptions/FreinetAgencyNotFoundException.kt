package app.ehrenamtskarte.backend.graphql.freinet.exceptions

import app.ehrenamtskarte.backend.graphql.shared.exceptions.GraphQLBaseException
import app.ehrenamtskarte.backend.graphql.shared.schema.GraphQLExceptionCode

class FreinetAgencyNotFoundException : GraphQLBaseException(
    GraphQLExceptionCode.FREINET_AGENCY_NOT_FOUND,
)
