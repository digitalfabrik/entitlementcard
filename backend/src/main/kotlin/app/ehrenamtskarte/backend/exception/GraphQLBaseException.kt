package app.ehrenamtskarte.backend.exception

import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode
import graphql.GraphqlErrorException

open class GraphQLBaseException(val code: GraphQLExceptionCode) : GraphqlErrorException(
    newErrorException().extensions(
        mapOf(
            Pair("code", code)
        )
    )
)
