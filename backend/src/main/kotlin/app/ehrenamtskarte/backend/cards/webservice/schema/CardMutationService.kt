package app.ehrenamtskarte.backend.cards.webservice.schema

import Card
import app.ehrenamtskarte.backend.application.database.ApplicationEntity
import app.ehrenamtskarte.backend.auth.getAdministrator
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.cards.Argon2IdHasher
import app.ehrenamtskarte.backend.cards.PEPPER_LENGTH
import app.ehrenamtskarte.backend.cards.database.CodeType
import app.ehrenamtskarte.backend.cards.database.repos.CardRepository
import app.ehrenamtskarte.backend.cards.hash
import app.ehrenamtskarte.backend.cards.service.CardActivator
import app.ehrenamtskarte.backend.cards.service.CardVerifier
import app.ehrenamtskarte.backend.cards.webservice.QRCodeUtil
import app.ehrenamtskarte.backend.cards.webservice.schema.types.ActivationState
import app.ehrenamtskarte.backend.cards.webservice.schema.types.CardActivationResultModel
import app.ehrenamtskarte.backend.cards.webservice.schema.types.CardCreationResultModel
import app.ehrenamtskarte.backend.cards.webservice.schema.types.DynamicActivationCodeResult
import app.ehrenamtskarte.backend.cards.webservice.schema.types.StaticVerificationCodeResult
import app.ehrenamtskarte.backend.common.webservice.context
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.NotFoundException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidCardHashException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidInputException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidQrCodeSize
import app.ehrenamtskarte.backend.exception.webservice.exceptions.RegionNotActivatedForCardConfirmationMailException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.RegionNotFoundException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.UserEntitlementExpiredException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.UserEntitlementNotFoundException
import app.ehrenamtskarte.backend.mail.Mailer
import app.ehrenamtskarte.backend.matomo.Matomo
import app.ehrenamtskarte.backend.regions.database.repos.RegionsRepository
import app.ehrenamtskarte.backend.userdata.KoblenzUser
import app.ehrenamtskarte.backend.userdata.database.UserEntitlementsRepository
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.google.protobuf.ByteString
import com.google.protobuf.InvalidProtocolBufferException
import extensionStartDayOrNull
import graphql.schema.DataFetchingEnvironment
import io.ktor.util.decodeBase64Bytes
import io.ktor.util.encodeBase64
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.security.SecureRandom
import java.sql.Connection.TRANSACTION_REPEATABLE_READ
import java.time.LocalDate
import java.util.Base64

@Suppress("unused")
class CardMutationService {
    private val logger: Logger = LoggerFactory.getLogger(CardMutationService::class.java)

    private val activationSecretLength = 20

    private fun createDynamicActivationCode(
        cardInfo: Card.CardInfo,
        userId: Int? = null,
        entitlementId: Int? = null,
    ): DynamicActivationCodeResult {
        val secureRandom = SecureRandom.getInstanceStrong()
        val pepper = ByteArray(PEPPER_LENGTH)
        secureRandom.nextBytes(pepper)

        val rawActivationSecret = ByteArray(activationSecretLength)
        secureRandom.nextBytes(rawActivationSecret)

        val activationSecretHash = CardActivator.hashActivationSecret(rawActivationSecret)
        val hashedCardInfo = cardInfo.hash(pepper)
        val dynamicActivationCode = Card.DynamicActivationCode.newBuilder()
            .setInfo(cardInfo)
            .setPepper(ByteString.copyFrom(pepper))
            .setActivationSecret(ByteString.copyFrom(rawActivationSecret))
            .build()

        if (!QRCodeUtil.isContentLengthValid(dynamicActivationCode)) {
            throw InvalidQrCodeSize(cardInfo.toByteArray().encodeBase64(), CodeType.DYNAMIC)
        }

        if (!cardInfo.extensions.hasExtensionRegion()) {
            throw InvalidCardHashException()
        }

        CardRepository.insert(
            hashedCardInfo,
            activationSecretHash,
            expirationDay = if (cardInfo.hasExpirationDay()) cardInfo.expirationDay.toLong() else null,
            cardInfo.extensions.extensionRegion.regionId,
            userId,
            entitlementId,
            CodeType.DYNAMIC,
            cardInfo.extensions.extensionStartDayOrNull?.startDay?.toLong(),
        )

        return DynamicActivationCodeResult(
            cardInfoHashBase64 = hashedCardInfo.encodeBase64(),
            codeBase64 = dynamicActivationCode.toByteArray().encodeBase64(),
        )
    }

    private fun createStaticVerificationCode(
        cardInfo: Card.CardInfo,
        userId: Int? = null,
        entitlementId: Int? = null,
    ): StaticVerificationCodeResult {
        val pepper = ByteArray(PEPPER_LENGTH)
        SecureRandom.getInstanceStrong().nextBytes(pepper)

        val hashedCardInfo = cardInfo.hash(pepper)
        val staticVerificationCode = Card.StaticVerificationCode.newBuilder()
            .setInfo(cardInfo)
            .setPepper(ByteString.copyFrom(pepper))
            .build()

        if (!QRCodeUtil.isContentLengthValid(staticVerificationCode)) {
            throw InvalidQrCodeSize(cardInfo.toByteArray().encodeBase64(), CodeType.STATIC)
        }

        CardRepository.insert(
            hashedCardInfo,
            null,
            expirationDay = if (cardInfo.hasExpirationDay()) cardInfo.expirationDay.toLong() else null,
            cardInfo.extensions.extensionRegion.regionId,
            userId,
            entitlementId,
            CodeType.STATIC,
            cardInfo.extensions.extensionStartDayOrNull?.startDay?.toLong(),
        )

        return StaticVerificationCodeResult(
            cardInfoHashBase64 = hashedCardInfo.encodeBase64(),
            codeBase64 = staticVerificationCode.toByteArray().encodeBase64(),
        )
    }

    @GraphQLDescription("Creates a new digital entitlementcard from self-service portal")
    fun createCardFromSelfService(
        dfe: DataFetchingEnvironment,
        project: String,
        encodedCardInfo: String,
        generateStaticCode: Boolean,
    ): CardCreationResultModel {
        val context = dfe.graphQlContext.context
        val config = context.backendConfiguration.getProjectConfig(project)
        if (!config.selfServiceEnabled) {
            throw NotFoundException()
        }

        val cardInfo = parseEncodedCardInfo(encodedCardInfo)
        val user = KoblenzUser(
            cardInfo.extensions.extensionBirthday.birthday,
            cardInfo.extensions.extensionKoblenzReferenceNumber.referenceNumber,
        )
        val userHash = Argon2IdHasher.hashKoblenzUserData(user)

        val userEntitlements = transaction {
            UserEntitlementsRepository.findByUserHash(userHash.toByteArray())
        }
        if (userEntitlements == null) {
            // This logging is used for rate limiting
            // See https://git.tuerantuer.org/DF/salt/pulls/187
            logger.info("${context.remoteIp} failed to create a new card")
            throw UserEntitlementNotFoundException()
        }
        if (userEntitlements.revoked || userEntitlements.endDate.isBefore(LocalDate.now())) {
            throw UserEntitlementExpiredException()
        }

        val updatedCardInfo = enrichCardInfo(
            cardInfo,
            userEntitlements.endDate.toEpochDay().toInt(),
            userEntitlements.startDate.toEpochDay().toInt(),
            userEntitlements.regionId.value,
        )

        val activationCode = transaction {
            val revokedCount = CardRepository.revokeByEntitlementId(userEntitlements.id.value)
            if (revokedCount > 0) {
                logger.info(
                    "Revoked {} cards associated with the user entitlements {}",
                    revokedCount,
                    userEntitlements.id.value,
                )
            }
            CardCreationResultModel(
                createDynamicActivationCode(
                    updatedCardInfo,
                    entitlementId = userEntitlements.id.value,
                ),
                if (generateStaticCode) {
                    createStaticVerificationCode(
                        updatedCardInfo,
                        entitlementId = userEntitlements.id.value,
                    )
                } else {
                    null
                },
            )
        }

        Matomo.trackCreateCards(
            context.backendConfiguration,
            config,
            context.request,
            dfe.field.name,
            userEntitlements.regionId.value,
            numberOfDynamicCards = 1,
            numberOfStaticCards = if (generateStaticCode) 1 else 0,
        )

        return activationCode
    }

    private fun enrichCardInfo(
        cardInfo: Card.CardInfo,
        expirationDay: Int,
        startDay: Int,
        regionId: Int,
    ): Card.CardInfo =
        cardInfo.toBuilder()
            .setExpirationDay(expirationDay)
            .setExtensions(
                cardInfo.extensions.toBuilder()
                    .setExtensionStartDay(
                        cardInfo.extensions.extensionStartDay.toBuilder()
                            .setStartDay(startDay)
                            .build(),
                    )
                    .setExtensionRegion(
                        cardInfo.extensions.extensionRegion.toBuilder()
                            .setRegionId(regionId)
                            .build(),
                    )
                    .build(),
            )
            .build()

    private fun parseEncodedCardInfo(encodedCardInfo: String): Card.CardInfo {
        val cardInfoBytes = encodedCardInfo.decodeBase64Bytes()
        try {
            return Card.CardInfo.parseFrom(cardInfoBytes)
        } catch (_: InvalidProtocolBufferException) {
            throw InvalidInputException("Failed to parse encodedCardInfo")
        }
    }

    @GraphQLDescription("Creates a new digital entitlementcard and returns it")
    fun createCardsByCardInfos(
        dfe: DataFetchingEnvironment,
        project: String,
        encodedCardInfos: List<String>,
        generateStaticCodes: Boolean,
        applicationIdToMarkAsProcessed: Int? = null,
    ): List<CardCreationResultModel> {
        val context = dfe.graphQlContext.context
        val projectConfig = context.backendConfiguration.getProjectConfig(project)
        val admin = context.getAdministrator()

        val activationCodes = transaction {
            encodedCardInfos.map { encodedCardInfo ->
                val cardInfo = parseEncodedCardInfo(encodedCardInfo)

                if (!Authorizer.mayCreateCardInRegion(admin, cardInfo.extensions.extensionRegion.regionId)) {
                    throw ForbiddenException()
                } else {
                    CardCreationResultModel(
                        dynamicActivationCode = createDynamicActivationCode(cardInfo, userId = admin.id.value),
                        staticVerificationCode = if (generateStaticCodes) {
                            createStaticVerificationCode(cardInfo, userId = admin.id.value)
                        } else {
                            null
                        },
                    )
                }
            }.also {
                if (applicationIdToMarkAsProcessed != null) {
                    ApplicationEntity.findByIdAndUpdate(applicationIdToMarkAsProcessed) {
                        it.status = ApplicationEntity.Status.ApprovedCardCreated
                    }
                }
            }
        }

        val regionId = admin.regionId?.value

        if (regionId != null) {
            Matomo.trackCreateCards(
                context.backendConfiguration,
                projectConfig,
                context.request,
                dfe.field.name,
                regionId,
                numberOfDynamicCards = encodedCardInfos.size,
                numberOfStaticCards = if (generateStaticCodes) encodedCardInfos.size else 0,
            )
        }

        return activationCodes
    }

    @GraphQLDescription("Activate a dynamic entitlement card")
    fun activateCard(
        project: String,
        cardInfoHashBase64: String,
        activationSecretBase64: String,
        overwrite: Boolean,
        dfe: DataFetchingEnvironment,
    ): CardActivationResultModel {
        val logger = LoggerFactory.getLogger(CardMutationService::class.java)
        val context = dfe.graphQlContext.context
        val projectConfig = context.backendConfiguration.getProjectConfig(project)
        val cardHash = Base64.getDecoder().decode(cardInfoHashBase64)
        val rawActivationSecret = Base64.getDecoder().decode(activationSecretBase64)

        // Avoid race conditions when activating a card.
        val activationResult = transaction(TRANSACTION_REPEATABLE_READ) t@{
            this.maxAttempts = 1

            val card = CardRepository.findByHash(project, cardHash)
            val activationSecretHash = card?.activationSecretHash

            if (card == null || activationSecretHash == null) {
                logger.info(
                    "${context.remoteIp} failed to activate card, card not found with cardHash:$cardInfoHashBase64",
                )
                return@t CardActivationResultModel(ActivationState.failed)
            }

            if (!CardActivator.verifyActivationSecret(rawActivationSecret, activationSecretHash)) {
                logger.info(
                    "${context.remoteIp} failed to activate card with id:${card.id} and overwrite: $overwrite",
                )
                return@t CardActivationResultModel(ActivationState.failed)
            }

            if (CardVerifier.isExpired(card.expirationDay, projectConfig.timezone)) {
                logger.info(
                    "${context.remoteIp} failed to activate card with id:${card.id} and overwrite: " +
                        "$overwrite because card is expired",
                )
                return@t CardActivationResultModel(ActivationState.failed)
            }

            if (card.revoked) {
                logger.info(
                    "${context.remoteIp} failed to activate card with id:${card.id} and overwrite: " +
                        "$overwrite because card is revoked",
                )
                return@t CardActivationResultModel(ActivationState.revoked)
            }

            if (!overwrite && card.totpSecret != null) {
                logger.info(
                    "Card with id:${card.id} did not overwrite card from ${context.remoteIp}",
                )
                return@t CardActivationResultModel(ActivationState.did_not_overwrite_existing)
            }

            val totpSecret = CardActivator.generateTotpSecret()
            val encodedTotpSecret = Base64.getEncoder().encodeToString(totpSecret)
            CardRepository.activate(card, totpSecret)
            logger.info(
                "Card with id:${card.id} and overwrite: $overwrite was activated from ${context.remoteIp}",
            )
            return@t CardActivationResultModel(ActivationState.success, encodedTotpSecret)
        }
        Matomo.trackActivation(
            context.backendConfiguration,
            projectConfig,
            context.request,
            dfe.field.name,
            cardHash,
            activationResult.activationState != ActivationState.failed,
        )
        return activationResult
    }

    @GraphQLDescription("Deletes a batch of cards (that have not yet been activated)")
    fun deleteInactiveCards(
        dfe: DataFetchingEnvironment,
        regionId: Int,
        cardInfoHashBase64List: List<String>,
    ): Boolean {
        val context = dfe.graphQlContext.context
        val admin = context.getAdministrator()

        val cardInfoHashList = cardInfoHashBase64List.map { it.decodeBase64Bytes() }
        transaction {
            if (!Authorizer.mayDeleteCardInRegion(admin, regionId)) {
                throw ForbiddenException()
            }
            CardRepository.deleteInactiveCardsByHash(regionId, cardInfoHashList)
        }
        return true
    }

    @GraphQLDescription(
        "Sends a confirmation mail to the user when the card creation was successful",
    )
    fun sendCardCreationConfirmationMail(
        dfe: DataFetchingEnvironment,
        project: String,
        regionId: Int,
        recipientAddress: String,
        recipientName: String,
        deepLink: String,
    ): Boolean {
        val context = dfe.graphQlContext.context
        val admin = context.getAdministrator()
        transaction {
            val region = admin.regionId?.value?.let {
                RegionsRepository.findByIdInProject(project, it) ?: throw RegionNotFoundException()
            }
            if (region != null && !region.activatedForCardConfirmationMail) {
                throw RegionNotActivatedForCardConfirmationMailException()
            }
            if (!Authorizer.maySendMailsInRegion(admin, regionId)) {
                throw ForbiddenException()
            }
            val backendConfig = dfe.graphQlContext.context.backendConfiguration
            val projectConfig = context.backendConfiguration.getProjectConfig(project)
            Mailer.sendCardCreationConfirmationMail(
                backendConfig,
                projectConfig,
                deepLink,
                recipientAddress,
                recipientName,
            )
        }
        return true
    }
}
