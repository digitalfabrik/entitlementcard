package app.ehrenamtskarte.backend.graphql.auth

import app.ehrenamtskarte.backend.shared.exceptions.ForbiddenException

fun requirePermission(permission: Boolean, createMessage: (() -> String)? = null) {
    if (!permission) {
        throw if (createMessage == null) ForbiddenException() else ForbiddenException(createMessage())
    }
}
