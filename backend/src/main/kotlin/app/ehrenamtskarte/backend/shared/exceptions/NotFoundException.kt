package app.ehrenamtskarte.backend.shared.exceptions

/**
 * will result in 404
 */
open class NotFoundException(reason: String = "Resource not found") : Exception(reason)
