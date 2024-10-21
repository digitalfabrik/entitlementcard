package app.ehrenamtskarte.backend.exception.service

/**
 * will result in 401
 */
class UnauthorizedException : Exception("Authorization token expired, invalid or missing")
