package app.ehrenamtskarte.backend.verification.webservice.schema

import app.ehrenamtskarte.backend.verification.service.CardVerifier
import app.ehrenamtskarte.backend.verification.webservice.schema.types.CardVerificationModel
import com.expediagroup.graphql.annotations.GraphQLDescription

@Suppress("unused")
class CardQueryService {
    @GraphQLDescription("Returns whether there is a card with that hash registered for that this TOTP is currently valid")
    fun verifyCard(card: CardVerificationModel): Boolean {
        return CardVerifier.verifyCardHash(card.hashModel, card.totp)
    }
}
