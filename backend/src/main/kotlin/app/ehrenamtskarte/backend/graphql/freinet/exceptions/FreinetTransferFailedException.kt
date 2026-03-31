package app.ehrenamtskarte.backend.graphql.freinet.exceptions

import app.ehrenamtskarte.backend.graphql.exceptions.GraphQLBaseException
import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode

class FreinetTransferFailedException : GraphQLBaseException(
    GraphQLExceptionCode.FREINET_TRANSFER_FAILED,
)
