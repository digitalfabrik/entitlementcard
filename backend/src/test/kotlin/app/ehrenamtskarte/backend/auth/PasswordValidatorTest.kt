package app.ehrenamtskarte.backend.auth

import app.ehrenamtskarte.backend.db.repositories.PasswordValidationResult
import app.ehrenamtskarte.backend.db.repositories.validatePassword
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals

internal class PasswordValidatorTest {
    @Test
    fun invalidatesPasswordIfTooShort() {
        val password = "a!Bcrf83592"
        assertEquals(validatePassword(password), PasswordValidationResult.NOT_LONG_ENOUGH)
    }

    @Test
    fun invalidatesPasswordIfTooFewLowercaseChars() {
        val password = "A!BCRF835921"
        assertEquals(validatePassword(password), PasswordValidationResult.TOO_FEW_LOWERCASE_CHARS)
    }

    @Test
    fun invalidatesPasswordIfTooFewUppercaseChars() {
        val password = "a!bcrf835921"
        assertEquals(validatePassword(password), PasswordValidationResult.TOO_FEW_UPPERCASE_CHARS)
    }

    @Test
    fun invalidatesPasswordIfTooFewSpecialChars() {
        val password = "a1Bcrf835921"
        assertEquals(validatePassword(password), PasswordValidationResult.TOO_FEW_SPECIAL_CHARS)
    }

    @Test
    fun validatesPassword() {
        val password = "a!Bcrf835921"
        assertEquals(validatePassword(password), PasswordValidationResult.VALID)
    }

    @Test
    fun validatesPasswordWithUmlauts() {
        val password = "a!Bcrf835921"
        assertEquals(validatePassword(password), PasswordValidationResult.VALID)
    }

    @Test
    fun validatesPasswordWithArabic() {
        val password = "1!مرحبا بالعAa"
        // Valid because all arabic characters are special-characters
        assertEquals(validatePassword(password), PasswordValidationResult.VALID)
    }
}
