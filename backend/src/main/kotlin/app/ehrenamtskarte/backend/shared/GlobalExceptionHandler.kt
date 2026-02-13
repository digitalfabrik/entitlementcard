package app.ehrenamtskarte.backend.shared

import app.ehrenamtskarte.backend.routes.exception.UserImportException
import app.ehrenamtskarte.backend.shared.exceptions.ForbiddenException
import app.ehrenamtskarte.backend.shared.exceptions.NotFoundException
import app.ehrenamtskarte.backend.shared.exceptions.UnauthorizedException
import io.sentry.Sentry
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.servlet.resource.NoResourceFoundException

@RestControllerAdvice
class GlobalExceptionHandler {
    private val logger = LoggerFactory.getLogger(GlobalExceptionHandler::class.java)

    @ExceptionHandler(UserImportException::class)
    fun handleUserImportException(ex: UserImportException): ResponseEntity<Map<String, String?>> =
        ResponseEntity.status(HttpStatus.BAD_REQUEST).body(mapOf("message" to ex.message))

    @ExceptionHandler(UnauthorizedException::class)
    fun handleUnauthorizedException(ex: UnauthorizedException): ResponseEntity<Map<String, String?>> =
        ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(mapOf("message" to ex.message))

    @ExceptionHandler(ForbiddenException::class)
    fun handleForbiddenException(ex: ForbiddenException): ResponseEntity<Map<String, String?>> =
        ResponseEntity.status(HttpStatus.FORBIDDEN).body(mapOf("message" to ex.message))

    @ExceptionHandler(NotFoundException::class)
    fun handleNotFoundException(ex: NotFoundException): ResponseEntity<Map<String, String?>?> =
        ResponseEntity.status(HttpStatus.NOT_FOUND).body(mapOf("message" to ex.message))

    @ExceptionHandler(NoResourceFoundException::class)
    fun handleNoResourceFound(ex: NoResourceFoundException): ResponseEntity<Map<String, String?>?> =
        ResponseEntity.status(HttpStatus.NOT_FOUND).body(mapOf("message" to ex.message))

    @ExceptionHandler(Exception::class)
    fun handleGeneralException(ex: Exception): ResponseEntity<Map<String, String>> {
        logger.error("Unhandled exception in HTTP route", ex)
        Sentry.captureException(ex)

        return ResponseEntity.status(
            HttpStatus.INTERNAL_SERVER_ERROR,
        ).body(mapOf("message" to "Internal error occurred"))
    }
}
