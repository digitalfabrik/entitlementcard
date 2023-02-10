package app.ehrenamtskarte.backend.verification.webservice.schema

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.common.webservice.UnauthorizedException
import app.ehrenamtskarte.backend.verification.database.CodeType
import app.ehrenamtskarte.backend.verification.database.repos.CardRepository
import app.ehrenamtskarte.backend.verification.service.CardActivator
import app.ehrenamtskarte.backend.verification.webservice.schema.types.ActivationState
import app.ehrenamtskarte.backend.verification.webservice.schema.types.CardActivationResultModel
import app.ehrenamtskarte.backend.verification.webservice.schema.types.CardGenerationModel
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.Base64

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
            val activationSecret =
                if (card.activationSecretBase64 != null)
                    Base64.getDecoder().decode(card.activationSecretBase64)
                else null

            CardRepository.insert(
                Base64.getDecoder().decode(card.cardInfoHashBase64),
                activationSecret,
                null,
                card.cardExpirationDay,
                card.regionId,
                user.id.value,
                card.codeType
            )
        }
        return true
    }

    @GraphQLDescription("Activate a digital EAK")
    fun activateCard(
        project: String,
        card: CardGenerationModel,
        overwrite: Boolean
    ): CardActivationResultModel {
        if (card.codeType == CodeType.static) {
            return CardActivationResultModel(ActivationState.failed)
        }

        val cardHash = Base64.getDecoder().decode(card.cardInfoHashBase64)
        val activationSecret = Base64.getDecoder().decode(card.activationSecretBase64)
        val activatedCard = transaction { CardRepository.findByHashModelAndActivationSecret(project, cardHash, activationSecret,) }

        if (activatedCard == null || activatedCard.activationSecret == null) {
            return CardActivationResultModel(ActivationState.failed)
        }

        if (!overwrite) {
            return CardActivationResultModel(ActivationState.did_not_overwrite_existing)
        }

        val totpSecret = CardActivator.generateTotpSecret()
        val encodedTotpSecret = Base64.getEncoder().encodeToString(totpSecret)

        transaction { CardRepository.reactivate(activatedCard, totpSecret) }
        return CardActivationResultModel(ActivationState.success, encodedTotpSecret)
    }
}
