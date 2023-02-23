package app.ehrenamtskarte.backend.verification.webservice.schema

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.common.webservice.UnauthorizedException
import app.ehrenamtskarte.backend.verification.database.CodeType
import app.ehrenamtskarte.backend.verification.database.repos.CardRepository
import app.ehrenamtskarte.backend.verification.service.CardActivator
import app.ehrenamtskarte.backend.verification.service.CardVerifier
import app.ehrenamtskarte.backend.verification.webservice.schema.types.ActivationState
import app.ehrenamtskarte.backend.verification.webservice.schema.types.CardActivationResultModel
import app.ehrenamtskarte.backend.verification.webservice.schema.types.CardGenerationModel
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.Base64

@Suppress("unused")
class CardMutationService {
    @GraphQLDescription("Stores a new digital entitlement card")
    fun addCard(dfe: DataFetchingEnvironment, card: CardGenerationModel): Boolean {
        val jwtPayload = dfe.getContext<GraphQLContext>().enforceSignedIn()

        if (!validateNewCard(card)) throw Exception("Card invalid.")

        transaction {
            val user =
                AdministratorEntity.findById(jwtPayload.adminId)
                    ?: throw UnauthorizedException()
            val targetedRegionId = card.regionId
            if (!Authorizer.mayCreateCardInRegion(user, targetedRegionId)) {
                throw UnauthorizedException()
            }
            val activationSecret =
                card.activationSecretBase64?.let {
                    Base64.getDecoder().decode(card.activationSecretBase64)
                }

            CardRepository.insert(
                Base64.getDecoder().decode(card.cardInfoHashBase64),
                activationSecret,
                card.cardExpirationDay,
                card.regionId,
                user.id.value,
                card.codeType
            )
        }
        return true
    }

    @GraphQLDescription("Activate a dynamic entitlement card")
    fun activateCard(
        project: String,
        cardInfoHashBase64: String,
        activationSecretBase64: String,
        overwrite: Boolean,
        dfe: DataFetchingEnvironment
    ): CardActivationResultModel {
        val context = dfe.getContext<GraphQLContext>()
        val projectConfig =
            context.backendConfiguration.projects.find { it.id == project }
                ?: throw NullPointerException("Project not found")
        val cardHash = Base64.getDecoder().decode(cardInfoHashBase64)
        val activationSecret = Base64.getDecoder().decode(activationSecretBase64)
        val card = transaction {
            CardRepository.findByHashAndActivationSecret(project, cardHash, activationSecret)
        }

        if (card == null) {
            return CardActivationResultModel(ActivationState.failed)
        }

        if (CardVerifier.isExpired(card.expirationDay, projectConfig.timezone) || card.revoked) {
            return CardActivationResultModel(ActivationState.failed)
        }

        if (!overwrite && card.totpSecret != null) {
            return CardActivationResultModel(ActivationState.did_not_overwrite_existing)
        }

        val totpSecret = CardActivator.generateTotpSecret()
        val encodedTotpSecret = Base64.getEncoder().encodeToString(totpSecret)
        transaction { CardRepository.activate(card, totpSecret) }
        return CardActivationResultModel(ActivationState.success, encodedTotpSecret)
    }

    private fun validateNewCard(card: CardGenerationModel): Boolean {
        return (card.codeType == CodeType.static && card.activationSecretBase64 == null) ||
            (card.codeType == CodeType.dynamic && card.activationSecretBase64 != null)
    }
}
