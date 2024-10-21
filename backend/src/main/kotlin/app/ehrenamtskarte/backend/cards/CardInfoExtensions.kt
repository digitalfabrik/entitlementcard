package app.ehrenamtskarte.backend.cards

import Card.CardInfo
import io.ktor.util.moveToByteArray

const val PEPPER_LENGTH = 16

fun CardInfo.hash(pepper: ByteArray): ByteArray {
    if (pepper.size != PEPPER_LENGTH) {
        throw Error("The pepper has an invalid length of ${pepper.size}.")
    }
    val jsonString = CanonicalJson.serializeToString(this)
    val jsonByteArray = Charsets.UTF_8.encode(jsonString).moveToByteArray()
    return Hmac.digest(jsonByteArray, pepper)
}
