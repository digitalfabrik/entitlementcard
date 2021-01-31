package app.ehrenamtskarte.backend.verification.webservice.schema

import app.ehrenamtskarte.backend.verification.service.CardVerifier
import app.ehrenamtskarte.backend.verification.webservice.schema.types.CardVerificationModel
import com.expediagroup.graphql.annotations.GraphQLDescription
import org.postgresql.util.Base64

@Suppress("unused")
class CardQueryService {
    @GraphQLDescription("Returns whether there is a card with that hash registered for that this TOTP is currently valid")
    fun verifyCard(card: CardVerificationModel): Boolean {
        return CardVerifier.verifyCardHash(Base64.decode(card.cardDetailsHashBase64), card.totp)
    }
}
