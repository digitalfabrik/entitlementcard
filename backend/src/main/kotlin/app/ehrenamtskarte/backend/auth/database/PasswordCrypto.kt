package app.ehrenamtskarte.backend.auth.database

import at.favre.lib.crypto.bcrypt.BCrypt
import java.security.MessageDigest
import java.security.SecureRandom
import java.util.Base64

object PasswordCrypto {
    private const val cost = 11

    fun hashPassword(password: String): ByteArray = BCrypt.withDefaults().hash(cost, password.toCharArray())

    fun verifyPassword(
        password: String,
        hash: ByteArray,
    ) = BCrypt.verifyer().verify(password.toCharArray(), hash).verified

    fun generatePasswordResetKey(): String {
        val resetKeyBytes = ByteArray(64)
        SecureRandom.getInstanceStrong().nextBytes(resetKeyBytes)
        return Base64.getUrlEncoder().encodeToString(resetKeyBytes)
    }

    fun hashPasswordResetKey(passwordResetKey: String): ByteArray {
        val resetKeyBytes = Base64.getUrlDecoder().decode(passwordResetKey)
        return hashWithSHA256(resetKeyBytes)
    }

    fun verifyPasswordResetKey(
        passwordResetKey: String,
        hash: ByteArray,
    ): Boolean {
        val actualHash = hashPasswordResetKey(passwordResetKey)
        return MessageDigest.isEqual(actualHash, hash)
    }

    fun hashWithSHA256(input: ByteArray): ByteArray = MessageDigest.getInstance("SHA-256").digest(input)
}
