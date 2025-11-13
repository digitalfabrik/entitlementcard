package app.ehrenamtskarte.backend.shared.exceptions

import app.ehrenamtskarte.backend.graphql.exceptions.GraphQLBaseException
import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode

class ProjectNotFoundException(projectId: String) : GraphQLBaseException(
    code = GraphQLExceptionCode.PROJECT_NOT_FOUND,
    message = "Project '$projectId' not found",
)
