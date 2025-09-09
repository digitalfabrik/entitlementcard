package app.ehrenamtskarte.backend.shared.exceptions

/**
 * will result in 401
 */
class UnauthorizedException : Exception("Authorization token expired, invalid or missing")
