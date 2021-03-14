package app.ehrenamtskarte.backend.common.webservice

class UnauthorizedException : Exception("JWT expired, invalid or missing")
