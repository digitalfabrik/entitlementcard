package app.ehrenamtskarte.backend.verification

import Card.CardInfo
import io.ktor.util.moveToByteArray
import java.nio.charset.Charset

const val PEPPER_LENGTH = 16

private fun CardInfo.binary(encoding: Charset): ByteArray {
    return encoding.encode(CanonicalJson.serializeToString(this)).moveToByteArray()
}
fun CardInfo.hash(pepper: ByteArray): ByteArray {
    if (pepper.size != PEPPER_LENGTH) {
        throw Error("The pepper has an invalid length of ${pepper.size}.")
    }
    return Hmac.digest(binary(Charsets.UTF_8), pepper)
}
