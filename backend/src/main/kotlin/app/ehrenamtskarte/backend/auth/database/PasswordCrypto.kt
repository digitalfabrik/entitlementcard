package app.ehrenamtskarte.backend.auth.database

import at.favre.lib.crypto.bcrypt.BCrypt

object PasswordCrypto {
    private const val cost = 11

    fun hashPasswort(password: String): ByteArray =
        BCrypt.withDefaults().hash(cost, password.toCharArray())

    fun verifyPassword(password: String, hash: ByteArray) =
        BCrypt.verifyer().verify(password.toCharArray(), hash).verified
}
