
package app.ehrenamtskarte.backend.exception.webservice.exceptions

import app.ehrenamtskarte.backend.exception.GraphQLBaseException
import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class MissingAuthorizationException() : GraphQLBaseException(GraphQLExceptionCode.MISSING_AUTHORIZATION)
