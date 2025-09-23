package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.exceptions.GraphQLExceptionCode

class RegionNotActivatedForCardConfirmationMailException : GraphQLBaseException(
    GraphQLExceptionCode.REGION_NOT_ACTIVATED_CARD_CONFIRMATION_MAIL,
)
