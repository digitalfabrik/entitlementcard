package app.ehrenamtskarte.backend.auth

const val minPasswordLength = 12
const val minLowercaseChars = 1
const val minUppercaseChars = 1
const val minNumericChars = 0
const val minSpecialChars = 1

enum class PasswordValidationResult {
    VALID,
    NOT_LONG_ENOUGH,
    TOO_FEW_LOWERCASE_CHARS,
    TOO_FEW_UPPERCASE_CHARS,
    TOO_FEW_NUMERIC_CHARS,
    TOO_FEW_SPECIAL_CHARS
}

object PasswordValidator {

    fun validatePassword(password: String): PasswordValidationResult {
        if (password.length < minPasswordLength) {
            return PasswordValidationResult.NOT_LONG_ENOUGH
        }
        val numLowercaseChars = password.count { it.isLowerCase() }
        val numUppercaseChars = password.count { it.isUpperCase() }
        val numNumericChars = password.count { it.isDigit() }
        val numSpecialChars = password.length - numLowercaseChars - numUppercaseChars - numNumericChars
        if (numLowercaseChars < minLowercaseChars) {
            return PasswordValidationResult.TOO_FEW_LOWERCASE_CHARS
        } else if (numUppercaseChars < minUppercaseChars) {
            return PasswordValidationResult.TOO_FEW_UPPERCASE_CHARS
        } else if (numNumericChars < minNumericChars) {
            return PasswordValidationResult.TOO_FEW_NUMERIC_CHARS
        } else if (numSpecialChars < minSpecialChars) {
            return PasswordValidationResult.TOO_FEW_SPECIAL_CHARS
        }
        return PasswordValidationResult.VALID
    }
}

class InvalidPasswordException(passwordValidation: PasswordValidationResult) :
    Throwable(message = passwordValidation.toString())
