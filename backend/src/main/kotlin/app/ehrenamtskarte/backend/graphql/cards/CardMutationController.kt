package app.ehrenamtskarte.backend.graphql.cards

import Card
import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.db.entities.ApplicationEntity
import app.ehrenamtskarte.backend.db.entities.CodeType
import app.ehrenamtskarte.backend.db.entities.TOTP_SECRET_LENGTH
import app.ehrenamtskarte.backend.db.entities.mayCreateCardInRegion
import app.ehrenamtskarte.backend.db.entities.mayDeleteCardInRegion
import app.ehrenamtskarte.backend.db.entities.maySendMailsInRegion
import app.ehrenamtskarte.backend.db.repositories.CardRepository
import app.ehrenamtskarte.backend.db.repositories.RegionsRepository
import app.ehrenamtskarte.backend.db.repositories.UserEntitlementsRepository
import app.ehrenamtskarte.backend.graphql.shared.context.RemoteIp
import app.ehrenamtskarte.backend.graphql.auth.requireAuthContext
import app.ehrenamtskarte.backend.graphql.cards.types.ActivationState
import app.ehrenamtskarte.backend.graphql.cards.types.CardActivationResultModel
import app.ehrenamtskarte.backend.graphql.cards.types.CardCreationResultModel
import app.ehrenamtskarte.backend.graphql.cards.types.DynamicActivationCodeResult
import app.ehrenamtskarte.backend.graphql.cards.types.StaticVerificationCodeResult
import app.ehrenamtskarte.backend.graphql.cards.utils.CardVerifier
import app.ehrenamtskarte.backend.graphql.cards.utils.KoblenzUser
import app.ehrenamtskarte.backend.graphql.cards.utils.PEPPER_LENGTH
import app.ehrenamtskarte.backend.graphql.cards.utils.QRCodeUtil
import app.ehrenamtskarte.backend.graphql.cards.utils.hash
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidCardHashException
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidInputException
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidQrCodeSize
import app.ehrenamtskarte.backend.graphql.exceptions.RegionNotActivatedForCardConfirmationMailException
import app.ehrenamtskarte.backend.graphql.exceptions.RegionNotFoundException
import app.ehrenamtskarte.backend.graphql.exceptions.UserEntitlementExpiredException
import app.ehrenamtskarte.backend.graphql.exceptions.UserEntitlementNotFoundException
import app.ehrenamtskarte.backend.graphql.shared.context.GraphQLContext
import app.ehrenamtskarte.backend.shared.Matomo
import app.ehrenamtskarte.backend.shared.crypto.Argon2IdHasher
import app.ehrenamtskarte.backend.shared.exceptions.ForbiddenException
import app.ehrenamtskarte.backend.shared.exceptions.NotFoundException
import app.ehrenamtskarte.backend.shared.mail.Mailer
import at.favre.lib.crypto.bcrypt.BCrypt
import com.eatthepath.otp.TimeBasedOneTimePasswordGenerator
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.extensions.get
import com.google.protobuf.ByteString
import com.google.protobuf.InvalidProtocolBufferException
import extensionStartDayOrNull
import graphql.schema.DataFetchingEnvironment
import io.ktor.util.decodeBase64Bytes
import io.ktor.util.encodeBase64
import jakarta.servlet.http.HttpServletRequest
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.MutationMapping
import org.springframework.stereotype.Controller
import java.security.SecureRandom
import java.sql.Connection.TRANSACTION_REPEATABLE_READ
import java.time.LocalDate
import java.util.Base64
import javax.crypto.KeyGenerator

@Controller
class CardMutationController(
    @Suppress("SpringJavaInjectionPointsAutowiringInspection")
    private val backendConfiguration: BackendConfiguration,
    private val request: HttpServletRequest,
) {
    private val logger: Logger = LoggerFactory.getLogger(CardMutationController::class.java)

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

        val activationSecretHash = hashActivationSecret(rawActivationSecret)
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
    @MutationMapping
    fun createCardFromSelfService(
        @Argument project: String,
        @Argument encodedCardInfo: String,
        @Argument generateStaticCode: Boolean,
        dfe: DataFetchingEnvironment,
        @GraphQLContext remoteIp: RemoteIp,
    ): CardCreationResultModel {
        logger.info(remoteIp.toString())

        val config = backendConfiguration.getProjectConfig(project)
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
            logger.info("${dfe.graphQlContext.get<RemoteIp>()} failed to create a new card")
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
            backendConfiguration,
            config,
            request,
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
    @MutationMapping
    fun createCardsByCardInfos(
        dfe: DataFetchingEnvironment,
        @Argument encodedCardInfos: List<String>,
        @Argument generateStaticCodes: Boolean,
        @Argument applicationIdToMarkAsProcessed: Int? = null,
    ): List<CardCreationResultModel> {
        val authContext = dfe.requireAuthContext()
        val projectConfig = backendConfiguration.getProjectConfig(authContext.project)

        val activationCodes = transaction {
            encodedCardInfos.map { encodedCardInfo ->
                val cardInfo = parseEncodedCardInfo(encodedCardInfo)

                if (!authContext.admin.mayCreateCardInRegion(cardInfo.extensions.extensionRegion.regionId)) {
                    throw ForbiddenException()
                } else {
                    CardCreationResultModel(
                        dynamicActivationCode = createDynamicActivationCode(
                            cardInfo,
                            userId = authContext.adminId,
                        ),
                        staticVerificationCode = if (generateStaticCodes) {
                            createStaticVerificationCode(cardInfo, userId = authContext.adminId)
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

        val regionId = authContext.admin.regionId?.value

        if (regionId != null) {
            Matomo.trackCreateCards(
                backendConfiguration,
                projectConfig,
                request,
                dfe.field.name,
                regionId,
                numberOfDynamicCards = encodedCardInfos.size,
                numberOfStaticCards = if (generateStaticCodes) encodedCardInfos.size else 0,
            )
        }

        return activationCodes
    }

    @GraphQLDescription("Activate a dynamic entitlement card")
    @MutationMapping
    fun activateCard(
        @Argument project: String,
        @Argument cardInfoHashBase64: String,
        @Argument activationSecretBase64: String,
        @Argument overwrite: Boolean,
        dfe: DataFetchingEnvironment,
    ): CardActivationResultModel {
        val projectConfig = backendConfiguration.getProjectConfig(project)
        val cardHash = Base64.getDecoder().decode(cardInfoHashBase64)
        val rawActivationSecret = Base64.getDecoder().decode(activationSecretBase64)

        // Avoid race conditions when activating a card.
        val activationResult = transaction(TRANSACTION_REPEATABLE_READ) t@{
            this.maxAttempts = 1

            val card = CardRepository.findByHash(project, cardHash)
            val activationSecretHash = card?.activationSecretHash

            if (card == null || activationSecretHash == null) {
                logger.info(
                    "${dfe.graphQlContext.get<RemoteIp>()} failed to activate card, card not found with cardHash:$cardInfoHashBase64",
                )
                return@t CardActivationResultModel(ActivationState.not_found)
            }

            if (!verifyActivationSecret(rawActivationSecret, activationSecretHash)) {
                logger.info(
                    "${dfe.graphQlContext.get<RemoteIp>()} failed to activate card with id:${card.id} and overwrite: $overwrite",
                )
                return@t CardActivationResultModel(ActivationState.wrong_secret)
            }

            if (CardVerifier.isExpired(card.expirationDay, projectConfig.timezone)) {
                logger.info(
                    "${dfe.graphQlContext.get<RemoteIp>()} failed to activate card with id:${card.id} and overwrite: " +
                        "$overwrite because card is expired",
                )
                return@t CardActivationResultModel(ActivationState.expired)
            }

            if (card.revoked) {
                logger.info(
                    "${dfe.graphQlContext.get<RemoteIp>()} failed to activate card with id:${card.id} and overwrite: " +
                        "$overwrite because card is revoked",
                )
                return@t CardActivationResultModel(ActivationState.revoked)
            }

            if (!overwrite && card.totpSecret != null) {
                logger.info(
                    "Card with id:${card.id} did not overwrite card from ${dfe.graphQlContext.get<RemoteIp>()}",
                )
                return@t CardActivationResultModel(ActivationState.did_not_overwrite_existing)
            }

            val totpSecret = generateTotpSecret()
            val encodedTotpSecret = Base64.getEncoder().encodeToString(totpSecret)
            CardRepository.activate(card, totpSecret)
            logger.info(
                "Card with id:${card.id} and overwrite: $overwrite was activated from ${dfe.graphQlContext.get<RemoteIp>()}",
            )
            return@t CardActivationResultModel(ActivationState.success, encodedTotpSecret)
        }
        Matomo.trackActivation(
            backendConfiguration,
            projectConfig,
            request,
            dfe.field.name,
            cardHash,
            activationResult.activationState == ActivationState.success,
        )
        return activationResult
    }

    @GraphQLDescription("Deletes a batch of cards (that have not yet been activated)")
    @MutationMapping
    fun deleteInactiveCards(
        @Argument regionId: Int,
        @Argument cardInfoHashBase64List: List<String>,
        dfe: DataFetchingEnvironment,
    ): Boolean {
        val authContext = dfe.requireAuthContext()
        val cardInfoHashList = cardInfoHashBase64List.map { it.decodeBase64Bytes() }

        transaction {
            if (!authContext.admin.mayDeleteCardInRegion(regionId)) {
                throw ForbiddenException()
            }
            CardRepository.deleteInactiveCardsByHash(regionId, cardInfoHashList)
        }
        return true
    }

    @GraphQLDescription(
        "Sends a confirmation mail to the user when the card creation was successful",
    )
    @MutationMapping
    fun sendCardCreationConfirmationMail(
        @Argument regionId: Int,
        @Argument recipientAddress: String,
        @Argument recipientName: String,
        @Argument deepLink: String,
        dfe: DataFetchingEnvironment,
    ): Boolean {
        val authContext = dfe.requireAuthContext()

        transaction {
            val region = authContext.admin.regionId?.value?.let {
                RegionsRepository.findByIdInProject(authContext.project, it) ?: throw RegionNotFoundException()
            }
            if (region != null && !region.activatedForCardConfirmationMail) {
                throw RegionNotActivatedForCardConfirmationMailException()
            }
            if (!authContext.admin.maySendMailsInRegion(regionId)) {
                throw ForbiddenException()
            }
            val projectConfig = backendConfiguration.getProjectConfig(authContext.project)
            Mailer.sendCardCreationConfirmationMail(
                backendConfiguration,
                projectConfig,
                deepLink,
                recipientAddress,
                recipientName,
            )
        }
        return true
    }
}

private const val cost = 10

fun hashActivationSecret(rawActivationSecret: ByteArray): ByteArray =
    BCrypt.withDefaults().hash(cost, rawActivationSecret)

@Synchronized
private fun generateTotpSecret(): ByteArray {
    // https://tools.ietf.org/html/rfc6238#section-3 - R3 (TOTP uses HTOP)
    // https://tools.ietf.org/html/rfc4226#section-4 - R6 (How long should a shared secret be?
    // -> 160bit)
    // https://tools.ietf.org/html/rfc4226#section-7.5 - Random Generation (How to generate a
    // secret? -> Random))))
    val algorithm = TimeBasedOneTimePasswordGenerator.TOTP_ALGORITHM_HMAC_SHA256
    val keyGenerator = KeyGenerator.getInstance(algorithm)
    keyGenerator.init(TOTP_SECRET_LENGTH * 8)

    return keyGenerator.generateKey().encoded
}

private fun verifyActivationSecret(rawActivationSecret: ByteArray, activationSecretHash: ByteArray): Boolean =
    BCrypt.verifyer().verify(rawActivationSecret, activationSecretHash).verified
