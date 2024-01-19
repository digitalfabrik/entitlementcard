package app.ehrenamtskarte.backend.verification.webservice.schema

import Card
import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.ProjectNotFoundException
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.matomo.Matomo
import app.ehrenamtskarte.backend.verification.CanonicalJson
import app.ehrenamtskarte.backend.verification.Hmac
import app.ehrenamtskarte.backend.verification.database.CodeType
import app.ehrenamtskarte.backend.verification.database.repos.CardRepository
import app.ehrenamtskarte.backend.verification.service.CardActivator
import app.ehrenamtskarte.backend.verification.service.CardVerifier
import app.ehrenamtskarte.backend.verification.webservice.schema.types.ActivationState
import app.ehrenamtskarte.backend.verification.webservice.schema.types.CardActivationResultModel
import app.ehrenamtskarte.backend.verification.webservice.schema.types.CardCreationModel
import app.ehrenamtskarte.backend.verification.webservice.schema.types.CardCreationResultModel
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.google.protobuf.ByteString
import graphql.schema.DataFetchingEnvironment
import io.ktor.util.encodeBase64
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.LoggerFactory
import java.security.SecureRandom
import java.sql.Connection.TRANSACTION_REPEATABLE_READ
import java.util.Base64

@Suppress("unused")
class CardMutationService {
    private val pepperLength = 16
    private val activationSecretLength = 20

    private fun createDynamicActivationCode(cardInfo: Card.CardInfo, userId: Int): String {
        return transaction {
            val pepper = ByteArray(pepperLength)
            SecureRandom.getInstanceStrong().nextBytes(pepper)

            val rawActivationSecret = ByteArray(activationSecretLength)
            SecureRandom.getInstanceStrong().nextBytes(rawActivationSecret)

            val activationSecret = CardActivator.hashActivationSecret(rawActivationSecret)
            val cardInfoBinary = CanonicalJson.serialize(cardInfo).toByteArray()
            val hashedCardInfo = Hmac.digest(cardInfoBinary, pepper)

            CardRepository.insert(
                hashedCardInfo,
                activationSecret,
                cardInfo.expirationDay.toLong(),
                cardInfo.extensions.extensionRegion.regionId,
                userId,
                CodeType.DYNAMIC,
                cardInfo.extensions.extensionStartDay.startDay.toLong()
            )

            Card.DynamicActivationCode.newBuilder()
                .setInfo(cardInfo)
                .setPepper(ByteString.copyFrom(pepper))
                .setActivationSecret(ByteString.copyFrom(rawActivationSecret))
                .build()
                .toByteArray()
                .encodeBase64()
        }
    }

    private fun createStativVerificationCode(cardInfo: Card.CardInfo, userId: Int): String {
        return transaction {
            val pepper = ByteArray(pepperLength)
            SecureRandom.getInstanceStrong().nextBytes(pepper)

            val cardInfoBinary = CanonicalJson.serialize(cardInfo).toByteArray()
            val hashedCardInfo = Hmac.digest(cardInfoBinary, pepper)

            CardRepository.insert(
                hashedCardInfo,
                null,
                cardInfo.expirationDay.toLong(),
                cardInfo.extensions.extensionRegion.regionId,
                userId,
                CodeType.STATIC,
                cardInfo.extensions.extensionStartDay.startDay.toLong()
            )

            Card.StaticVerificationCode.newBuilder()
                .setInfo(cardInfo)
                .setPepper(ByteString.copyFrom(pepper))
                .build()
                .toByteArray()
                .encodeBase64()
        }
    }

    @GraphQLDescription("Creates a new digital entitlementcard and returns it")
    fun createCards(dfe: DataFetchingEnvironment, cards: List<CardCreationModel>): List<CardCreationResultModel> {
        val context = dfe.getContext<GraphQLContext>()
        val jwtPayload = context.enforceSignedIn()
        val activationCodes = transaction {
            val user =
                AdministratorEntity.findById(jwtPayload.adminId)
                    ?: throw UnauthorizedException()

            return@transaction cards.map { card ->
                val decodedCardInfoHash = Base64.getDecoder().decode(card.encodedCardInfoBase64)
                val cardInfo = Card.CardInfo.parseFrom(decodedCardInfoHash)

                if (!Authorizer.mayCreateCardInRegion(user, cardInfo.extensions.extensionRegion.regionId)) {
                    throw ForbiddenException()
                }
                return@map CardCreationResultModel(
                    if (card.generateDynamicActivationCode) createDynamicActivationCode(cardInfo, user.id.value) else null,
                    if (card.generateStaticVerificationCode) createStativVerificationCode(cardInfo, user.id.value) else null
                )
            }
        }

        return activationCodes
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

        // Avoid race conditions when activating a card.
        val activationResult = transaction(TRANSACTION_REPEATABLE_READ) t@{
            repetitionAttempts = 0
            val card = CardRepository.findByHash(project, cardHash)
            val activationSecretHash = card?.activationSecretHash

            if (card == null || activationSecretHash == null) {
                logger.info("${context.remoteIp} failed to activate card, card not found with cardHash:$cardInfoHashBase64")
                return@t CardActivationResultModel(ActivationState.failed)
            }

            if (!CardActivator.verifyActivationSecret(rawActivationSecret, activationSecretHash)) {
                logger.info("${context.remoteIp} failed to activate card with id:${card.id} and overwrite: $overwrite")
                return@t CardActivationResultModel(ActivationState.failed)
            }

            if (CardVerifier.isExpired(card.expirationDay, projectConfig.timezone) || card.revoked) {
                logger.info("${context.remoteIp} failed to activate card with id:${card.id} and overwrite: $overwrite because card isExpired or revoked")
                return@t CardActivationResultModel(ActivationState.failed)
            }

            if (!overwrite && card.totpSecret != null) {
                logger.info("Card with id:${card.id} did not overwrite card from ${context.remoteIp}")
                return@t CardActivationResultModel(ActivationState.did_not_overwrite_existing)
            }

            val totpSecret = CardActivator.generateTotpSecret()
            val encodedTotpSecret = Base64.getEncoder().encodeToString(totpSecret)
            CardRepository.activate(card, totpSecret)
            logger.info("Card with id:${card.id} and overwrite: $overwrite was activated from ${context.remoteIp}")
            return@t CardActivationResultModel(ActivationState.success, encodedTotpSecret)
        }
        Matomo.trackActivation(projectConfig, context.request, dfe.field.name, cardHash, activationResult.activationState != ActivationState.failed)
        return activationResult
    }
}
