package app.ehrenamtskarte.backend.shared.exceptions

import app.ehrenamtskarte.backend.routes.exception.UserImportException
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.multipart.support.MissingServletRequestPartException

@RestControllerAdvice
class GlobalExceptionHandler {

    private val logger = LoggerFactory.getLogger(GlobalExceptionHandler::class.java)

    @ExceptionHandler(UserImportException::class)
    fun handleUserImportException(ex: UserImportException): ResponseEntity<Map<String, String?>> {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(mapOf("message" to ex.message))
    }

    @ExceptionHandler(MissingServletRequestPartException::class)
    fun handleMissingPartException(ex: MissingServletRequestPartException): ResponseEntity<Map<String, String>> {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(mapOf("message" to "Required part 'file' is not present."))
    }

    @ExceptionHandler(UnauthorizedException::class)
    fun handleUnauthorizedException(ex: UnauthorizedException): ResponseEntity<Map<String, String?>> {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(mapOf("message" to ex.message))
    }

    @ExceptionHandler(ForbiddenException::class)
    fun handleForbiddenException(ex: ForbiddenException): ResponseEntity<Map<String, String?>> {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(mapOf("message" to ex.message))
    }

    @ExceptionHandler(ProjectNotFoundException::class)
    fun handleProjectNotFoundException(ex: ProjectNotFoundException): ResponseEntity<Map<String, String?>> {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(mapOf("message" to ex.message))
    }

    @ExceptionHandler(Exception::class)
    fun handleGeneralException(ex: Exception): ResponseEntity<Map<String, String>> {
        logger.error("An internal error occurred", ex)
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(mapOf("message" to "Internal error occurred"))
    }
}
