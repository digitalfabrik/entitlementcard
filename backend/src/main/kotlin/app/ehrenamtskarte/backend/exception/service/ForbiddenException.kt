package app.ehrenamtskarte.backend.exception.service

/**
 * will result in 403
 */
open class ForbiddenException(reason: String = "Insufficient access rights") : Exception(reason)
