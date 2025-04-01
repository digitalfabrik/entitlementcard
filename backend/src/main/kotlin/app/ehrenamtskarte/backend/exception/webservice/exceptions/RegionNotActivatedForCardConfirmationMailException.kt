package app.ehrenamtskarte.backend.exception.webservice.exceptions

import app.ehrenamtskarte.backend.exception.GraphQLBaseException
import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class RegionNotActivatedForCardConfirmationMailException : GraphQLBaseException(
    GraphQLExceptionCode.REGION_NOT_ACTIVATED_CARD_CONFIRMATION_MAIL,
)
