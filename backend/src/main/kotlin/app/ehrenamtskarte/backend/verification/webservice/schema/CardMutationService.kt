package app.ehrenamtskarte.backend.verification.webservice.schema

import app.ehrenamtskarte.backend.verification.database.repos.CardRepository
import app.ehrenamtskarte.backend.verification.domain.Card
import com.expediagroup.graphql.annotations.GraphQLDescription
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.util.Base64
import app.ehrenamtskarte.backend.verification.webservice.schema.types.Card as CardTO


@Suppress("unused")
@ExperimentalUnsignedTypes
class CardMutationService {
    @GraphQLDescription("Stores a new digital EAK")
    fun addCard(card: CardTO): Boolean {
        transaction {
            CardRepository.insert(
                Card(
                    Base64.getDecoder().decode(card.totpSecretBase64).asList(),
                    LocalDateTime.ofEpochSecond(card.expirationDate, 0, ZoneOffset.UTC),
                    card.hashModel
                )
            )
        }
        return true
    }
}
