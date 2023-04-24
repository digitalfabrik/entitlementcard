package app.ehrenamtskarte.backend.exception.service

/**
 * will result in 401
 */
class UnauthorizedException : Exception("JWT expired, invalid or missing")
