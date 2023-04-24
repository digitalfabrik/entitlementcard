package app.ehrenamtskarte.backend.exception.service

/**
 * will result in 404
 */
open class NotFoundException(reason: String = "Resource not found") : Exception(reason)
