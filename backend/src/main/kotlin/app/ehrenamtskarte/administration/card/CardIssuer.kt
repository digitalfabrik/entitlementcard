package app.ehrenamtskarte.administration.card

import app.ehrenamtskarte.administration.serialization.QRCodeGenerator
import com.beust.klaxon.Klaxon
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.slf4j.Logger
import org.slf4j.LoggerFactory


class CardIssuer(
    private val cardTokenGenerator: CardTokenGenerator =
        CardTokenGenerator(Keys.keyPairFor(SignatureAlgorithm.ES256).private)
) {
    private val logger: Logger = LoggerFactory.getLogger(CardIssuer::class.java)

    private val klaxon = Klaxon()
    private val qrCodeGenerator = QRCodeGenerator()

    fun generateCardIssueQrCode(cardDetails: CardDetails): ByteArray {
        val payload = klaxon.toJsonString(cardDetails)
        val cardToken = try {
            cardTokenGenerator.createCardToken(payload)
        } catch (e: CardIssueException) {
            logger.error(e.message, e)
            // don't expose internal details
            throw CardIssueException("Internal server error while creating token, check server logs for details.")
        }
        return qrCodeGenerator.generateQrCode(cardToken)
    }
}
