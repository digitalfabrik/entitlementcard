package app.ehrenamtskarte.backend.shared.exceptions

/**
 * will result in 403
 */
open class ForbiddenException(reason: String = "Insufficient access rights") : Exception(reason)
