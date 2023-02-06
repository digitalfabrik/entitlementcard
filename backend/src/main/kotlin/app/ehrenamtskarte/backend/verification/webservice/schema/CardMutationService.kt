package app.ehrenamtskarte.backend.verification.webservice.schema

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.common.webservice.UnauthorizedException
import app.ehrenamtskarte.backend.verification.database.repos.CardRepository
import app.ehrenamtskarte.backend.verification.service.CardVerifier
import app.ehrenamtskarte.backend.verification.webservice.schema.types.CardGenerationModel
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction
import java.nio.ByteBuffer
import java.util.Base64

enum class ActivationState {
    success,
    did_not_overwrite_existing,
    failed
}

@Suppress("unused")
class CardMutationService {
    @GraphQLDescription("Stores a new digital EAK")
    fun addCard(dfe: DataFetchingEnvironment, card: CardGenerationModel): Boolean {
        val jwtPayload = dfe.getContext<GraphQLContext>().enforceSignedIn()

        transaction {
            val user = AdministratorEntity.findById(jwtPayload.adminId) ?: throw UnauthorizedException()
            val targetedRegionId = card.regionId
            if (!Authorizer.mayCreateCardInRegion(user, targetedRegionId)) {
                throw UnauthorizedException()
            }
            createCard(card, user)
        }
        return true
    }

    fun activateCard(dfe: DataFetchingEnvironment, project: String, card: CardGenerationModel, overwrite: Boolean): ActivationState {
        val context = dfe.getContext<GraphQLContext>()
        val jwtPayload = context.enforceSignedIn()
        val projectConfig = context.backendConfiguration.projects.find { it.id == project } ?: throw NullPointerException("Project not found")

        transaction {
            val user = AdministratorEntity.findById(jwtPayload.adminId) ?: throw UnauthorizedException()

            val targetedRegionId = card.regionId
            if (!Authorizer.mayCreateCardInRegion(user, targetedRegionId)) {
                throw UnauthorizedException()
            }

            val cardHash = Base64.getDecoder().decode(card.cardInfoHashBase64)
            val activatedCard = transaction { CardRepository.findByHashModel(projectConfig, cardHash) }

            if (activatedCard == null) {
                return if (createCard(card, user)) ActivationState.success else ActivationState.failed
            } else if (activatedCard != null && overwrite) {
                // reactivate card
                CardRepository.activate(activatedCard, card.totpSecret)
                return ActivationState.success
            }
            return ActivationState.did_not_overwrite_existing
        }
    }

    private fun createCard(card: CardGenerationModel, issuer: Administrators): Boolean {
        transaction {
            val activationSecret = if (card.activationSecret != null) Base64.getDecoder().decode(card.activationSecret) else null

            val totpSecret = if (activationSecret != null) {
                val otp = CardVerifier.generateTotp(activationSecret)
                Base64.getEncoder().encode(ByteBuffer.allocate(Int.SIZE_BYTES).putInt(otp).array())
            } else null

            CardRepository.insert(
                Base64.getDecoder().decode(card.cardInfoHashBase64),
                activationSecret,
                totpSecret,
                card.cardExpirationDay,
                card.regionId,
                issuer.id.value,
                card.codeType
            )
        }
        return true
    }
}
