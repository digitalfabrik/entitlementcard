package app.ehrenamtskarte.backend.exception.webservice.exceptions

import app.ehrenamtskarte.backend.auth.PasswordValidationResult
import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode
import graphql.GraphqlErrorException

open class InvalidPasswordException(validationResult: PasswordValidationResult) : GraphqlErrorException(
    newErrorException().extensions(
        mapOf(
            Pair("code", GraphQLExceptionCode.INVALID_PASSWORD),
            Pair("validationResult", validationResult)
        )
    )
)
