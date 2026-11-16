package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode

class PhysicalCardNotAvailableInRegionException : GraphQLBaseException(
    GraphQLExceptionCode.PHYSICAL_CARD_NOT_AVAILABLE_IN_REGION,
)
