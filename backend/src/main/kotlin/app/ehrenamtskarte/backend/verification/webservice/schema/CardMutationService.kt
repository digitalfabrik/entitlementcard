package app.ehrenamtskarte.backend.verification.webservice.schema

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.ProjectNotFoundException
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidCodeTypeException
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
import org.slf4j.LoggerFactory
import java.util.Base64

@Suppress("unused")
class CardMutationService {
    @GraphQLDescription("Stores a batch of new digital entitlementcards")
    fun addCards(dfe: DataFetchingEnvironment, cards: List<CardGenerationModel>): Boolean {
        val jwtPayload = dfe.getContext<GraphQLContext>().enforceSignedIn()

        transaction {
            val user =
                AdministratorEntity.findById(jwtPayload.adminId)
                    ?: throw UnauthorizedException()

            for (card in cards) {
                val targetedRegionId = card.regionId
                if (!Authorizer.mayCreateCardInRegion(user, targetedRegionId)) {
                    throw ForbiddenException()
                }
                if (!validateNewCard(card)) {
                    throw InvalidCodeTypeException()
                }
                val activationSecret =
                    card.activationSecretBase64?.let {
                        val decodedRawActivationSecret = Base64.getDecoder().decode(it)
                        CardActivator.hashActivationSecret(decodedRawActivationSecret)
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
        val logger = LoggerFactory.getLogger(CardMutationService::class.java)
        val context = dfe.getContext<GraphQLContext>()
        val projectConfig =
            context.backendConfiguration.projects.find { it.id == project }
                ?: throw ProjectNotFoundException(project)
        val cardHash = Base64.getDecoder().decode(cardInfoHashBase64)
        val rawActivationSecret = Base64.getDecoder().decode(activationSecretBase64)
        val card = transaction { CardRepository.findByHash(project, cardHash) }
        val activationSecretHash = card?.activationSecretHash

        if (card == null || activationSecretHash == null) {
            return CardActivationResultModel(ActivationState.failed)
        }

        if (!CardActivator.verifyActivationSecret(rawActivationSecret, activationSecretHash)) {
            logger.info("${context.remoteIp} failed to activate entitlement card")
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
        return (card.codeType == CodeType.STATIC && card.activationSecretBase64 == null) ||
            (card.codeType == CodeType.DYNAMIC && card.activationSecretBase64 != null)
    }
}
