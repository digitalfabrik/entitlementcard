package app.ehrenamtskarte.backend.cards

import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec

object Hmac {
    fun digest(
        msg: ByteArray,
        key: ByteArray,
        alg: String = "HmacSHA256",
    ): ByteArray {
        val signingKey = SecretKeySpec(key, alg)
        val mac = Mac.getInstance(alg)
        mac.init(signingKey)

        return mac.doFinal(msg)
    }
}
