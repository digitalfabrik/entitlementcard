package app.ehrenamtskarte.backend.auth

import org.junit.Test
import kotlin.test.assertEquals

internal class PasswordValidatorTest {

    @Test
    fun invalidatesPasswordIfTooShort() {
        val password = "a!Bcrf83592"
        assertEquals(
            PasswordValidator.validatePassword(password),
            PasswordValidationResult.NOT_LONG_ENOUGH
        )
    }

    @Test
    fun invalidatesPasswordIfTooFewLowercaseChars() {
        val password = "A!BCRF835921"
        assertEquals(
            PasswordValidator.validatePassword(password),
            PasswordValidationResult.TOO_FEW_LOWERCASE_CHARS
        )
    }

    @Test
    fun invalidatesPasswordIfTooFewUppercaseChars() {
        val password = "a!bcrf835921"
        assertEquals(
            PasswordValidator.validatePassword(password),
            PasswordValidationResult.TOO_FEW_UPPERCASE_CHARS
        )
    }

    @Test
    fun invalidatesPasswordIfTooFewSpecialChars() {
        val password = "a1Bcrf835921"
        assertEquals(
            PasswordValidator.validatePassword(password),
            PasswordValidationResult.TOO_FEW_SPECIAL_CHARS
        )
    }

    @Test
    fun validatesPassword() {
        val password = "a!Bcrf835921"
        assertEquals(
            PasswordValidator.validatePassword(password),
            PasswordValidationResult.VALID
        )
    }
}
