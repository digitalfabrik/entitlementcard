package app.ehrenamtskarte.backend.verification.webservice.schema

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.common.webservice.UnauthorizedException
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
        val jwtPayload = dfe.getContext<GraphQLContext>().enforceSignedIn()

        transaction {
            val user = AdministratorEntity.findById(jwtPayload.userId) ?: throw UnauthorizedException()
            val targetedRegionId = card.regionId
            if (!Authorizer.mayCreateCardInRegion(user, targetedRegionId)) {
                throw UnauthorizedException()
            }

            CardRepository.insert(
                Base64.decode(card.cardDetailsHashBase64),
                Base64.decode(card.totpSecretBase64),
                LocalDateTime.ofEpochSecond(
                    card.cardExpirationDay * 24L * 60L * 60L,
                    0,
                    ZoneOffset.UTC
                ),
                card.regionId
            )
        }
        return true
    }
}
