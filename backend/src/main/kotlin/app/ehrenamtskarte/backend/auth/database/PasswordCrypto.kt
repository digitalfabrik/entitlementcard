package app.ehrenamtskarte.backend.auth.database

import at.favre.lib.crypto.bcrypt.BCrypt
import at.favre.lib.crypto.bcrypt.LongPasswordStrategies

object PasswordCrypto {
    private const val cost = 11

    fun hashPasswort(password: String): ByteArray =
        BCrypt.withDefaults().hash(cost, password.toCharArray())

    fun verifyPassword(password: String, hash: ByteArray) =
        BCrypt.verifyer().verify(password.toCharArray(), hash).verified

    fun hashPasswordResetKey(passwordResetKey: String): ByteArray =
        BCrypt.with(LongPasswordStrategies.none()).hash(cost, passwordResetKey.toCharArray())

    fun verifyPasswordResetKey(passwordResetKey: String, hash: ByteArray) =
        BCrypt.verifyer(null, LongPasswordStrategies.none()).verify(passwordResetKey.toCharArray(), hash).verified
}
