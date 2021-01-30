package app.ehrenamtskarte.backend.verification.webservice.schema

import app.ehrenamtskarte.backend.verification.database.repos.CardRepository
import app.ehrenamtskarte.backend.verification.domain.Card
import com.expediagroup.graphql.annotations.GraphQLDescription
import org.jetbrains.exposed.sql.transactions.transaction
import org.postgresql.util.Base64
import java.time.LocalDateTime
import java.time.ZoneOffset
import app.ehrenamtskarte.backend.verification.webservice.schema.types.Card as CardTO


@Suppress("unused")
@ExperimentalUnsignedTypes
class CardMutationService {
    @GraphQLDescription("Stores a new digital EAK")
    fun addCard(card: CardTO): Boolean {
        transaction {
            CardRepository.insert(
                Card(
                    Base64.decode(card.totpSecretBase64).asList(),
                    LocalDateTime.ofEpochSecond(card.expirationDate, 0, ZoneOffset.UTC),
                    Base64.decode(card.hashModelBase64).asList()
                )
            )
        }
        return true
    }
}
