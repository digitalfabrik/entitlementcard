package app.ehrenamtskarte.backend.verification.webservice.schema

import app.ehrenamtskarte.backend.common.webservice.DEFAULT_PROJECT
import app.ehrenamtskarte.backend.verification.service.CardVerifier
import app.ehrenamtskarte.backend.verification.webservice.schema.types.CardVerificationModel
import com.expediagroup.graphql.annotations.GraphQLDescription
import org.postgresql.util.Base64

@Suppress("unused")
class CardQueryService {
    @GraphQLDescription("Returns whether there is a card with that hash registered for that this TOTP is currently valid")
    fun verifyCard(project: String = DEFAULT_PROJECT, card: CardVerificationModel): Boolean {
        return CardVerifier.verifyCardHash(project, Base64.decode(card.cardDetailsHashBase64), card.totp)
    }
}
