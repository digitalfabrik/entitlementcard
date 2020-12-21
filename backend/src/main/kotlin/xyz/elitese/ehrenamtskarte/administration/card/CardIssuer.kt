package xyz.elitese.ehrenamtskarte.administration.card

import com.beust.klaxon.Klaxon
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import xyz.elitese.ehrenamtskarte.administration.serialization.QRCodeGenerator


class CardIssuer(
    private val cardTokenGenerator: CardTokenGenerator =
        CardTokenGenerator(Keys.keyPairFor(SignatureAlgorithm.ES256).private)
) {
    private val klaxon = Klaxon()
    private val qrCodeGenerator = QRCodeGenerator()

    fun generateCardIssueQrCode(cardDetails: CardDetails): ByteArray {
        val payload = klaxon.toJsonString(cardDetails)
        val cardToken = try {
            cardTokenGenerator.createCardToken(payload)
        } catch (e: CardIssueException) {
            println(e.message)
            e.printStackTrace()
            // don't expose internal details
            throw CardIssueException("Internal server error while creating token, check server logs for details.")
        }
        return qrCodeGenerator.generateQrCode(cardToken)
    }
}
