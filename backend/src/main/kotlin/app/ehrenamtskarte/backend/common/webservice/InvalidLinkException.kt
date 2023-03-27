package app.ehrenamtskarte.backend.common.webservice

import graphql.GraphqlErrorException

class InvalidLinkException() : GraphqlErrorException(
    newErrorException().extensions(
        mapOf(
            Pair("code", "INVALID_LINK"),
        ),
    ),
)
