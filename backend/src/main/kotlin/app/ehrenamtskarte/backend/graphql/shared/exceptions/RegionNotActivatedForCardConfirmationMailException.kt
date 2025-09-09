package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.graphql.shared.schema.GraphQLExceptionCode

class RegionNotActivatedForCardConfirmationMailException : GraphQLBaseException(
    GraphQLExceptionCode.REGION_NOT_ACTIVATED_CARD_CONFIRMATION_MAIL,
)
