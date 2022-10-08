package app.ehrenamtskarte.backend.verification.webservice.schema

import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.verification.database.repos.CardRepository
import app.ehrenamtskarte.backend.verification.webservice.schema.types.CardGenerationModel
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction
import org.postgresql.util.Base64
import java.time.LocalDateTime
import java.time.ZoneOffset

@Suppress("unused")
class CardMutationService {
    @GraphQLDescription("Stores a new digital EAK")
    fun addCard(dfe: DataFetchingEnvironment, card: CardGenerationModel): Boolean {
        dfe.getLocalContext<GraphQLContext>().enforceSignedIn()
        transaction {
            CardRepository.insert(
                Base64.decode(card.cardDetailsHashBase64),
                Base64.decode(card.totpSecretBase64),
                if (card.expirationDate > 0) LocalDateTime.ofEpochSecond(
                    card.expirationDate,
                    0,
                    ZoneOffset.UTC
                ) else null,
                card.regionId
            )
        }
        return true
    }
}
