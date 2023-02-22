package app.ehrenamtskarte.backend.verification.service

import app.ehrenamtskarte.backend.verification.database.TOTP_SECRET_LENGTH
import com.eatthepath.otp.TimeBasedOneTimePasswordGenerator
import javax.crypto.KeyGenerator
import javax.crypto.Mac

object CardActivator {

    public fun generateTotpSecret(): ByteArray {
        // https://tools.ietf.org/html/rfc6238#section-3 - R3 (TOTP uses HTOP)
        // https://tools.ietf.org/html/rfc4226#section-4 - R6 (How long should a shared secret be? -> 160bit)
        // https://tools.ietf.org/html/rfc4226#section-7.5 - Random Generation (How to generate a secret? -> Random))))
        val totpGenerator = TimeBasedOneTimePasswordGenerator(
            TIME_STEP,
            TOTP_LENGTH,
            TimeBasedOneTimePasswordGenerator.TOTP_ALGORITHM_HMAC_SHA256
        )
        val keyGenerator = KeyGenerator.getInstance(totpGenerator.getAlgorithm())
        val macLengthInBytes = Mac.getInstance(totpGenerator.getAlgorithm()).getMacLength()
        keyGenerator.init(macLengthInBytes * TOTP_SECRET_LENGTH)

        return keyGenerator.generateKey().encoded
    }
}
