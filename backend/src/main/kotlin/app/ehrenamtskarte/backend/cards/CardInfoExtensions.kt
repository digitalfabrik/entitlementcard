package app.ehrenamtskarte.backend.cards

import Card.CardInfo
import app.ehrenamtskarte.backend.graphql.cards.CanonicalJson
import io.ktor.util.moveToByteArray
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec

const val PEPPER_LENGTH = 16

fun CardInfo.hash(pepper: ByteArray): ByteArray {
    if (pepper.size != PEPPER_LENGTH) {
        throw Error("The pepper has an invalid length of ${pepper.size}.")
    }
    val jsonString = CanonicalJson.serializeToString(this)
    val jsonByteArray = Charsets.UTF_8.encode(jsonString).moveToByteArray()

    return Mac.getInstance("HmacSHA256")
        .apply { init(SecretKeySpec(pepper, "HmacSHA256")) }
        .doFinal(jsonByteArray)
}
