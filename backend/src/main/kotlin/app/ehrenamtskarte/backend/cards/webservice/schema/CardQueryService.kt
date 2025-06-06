package app.ehrenamtskarte.backend.cards.webservice.schema

import app.ehrenamtskarte.backend.cards.database.CodeType
import app.ehrenamtskarte.backend.cards.service.CardVerifier
import app.ehrenamtskarte.backend.cards.webservice.schema.types.CardVerificationModel
import app.ehrenamtskarte.backend.cards.webservice.schema.types.CardVerificationResultModel
import app.ehrenamtskarte.backend.common.webservice.context
import app.ehrenamtskarte.backend.matomo.Matomo
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import java.util.Base64

@Suppress("unused")
class CardQueryService {
    @Deprecated(
        "Deprecated since May 2023 in favor of CardVerificationResultModel that return a current timestamp",
        ReplaceWith("verifyCardInProjectV2"),
    )
    @GraphQLDescription(
        "Returns whether there is a card in the given project with that hash registered for that this TOTP is currently valid and a timestamp of the last check",
    )
    fun verifyCardInProject(project: String, card: CardVerificationModel, dfe: DataFetchingEnvironment): Boolean =
        verifyCardInProjectV2(project, card, dfe).valid

    @GraphQLDescription(
        "Returns whether there is a card in the given project with that hash registered for that this TOTP is currently valid, extendable and a timestamp of the last check",
    )
    fun verifyCardInProjectV2(
        project: String,
        card: CardVerificationModel,
        dfe: DataFetchingEnvironment,
    ): CardVerificationResultModel {
        val context = dfe.graphQlContext.context
        val projectConfig = context.backendConfiguration.getProjectConfig(project)
        val cardHash = Base64.getDecoder().decode(card.cardInfoHashBase64)

        val isValid = when (card.codeType) {
            CodeType.STATIC ->
                card.totp == null &&
                    CardVerifier.verifyStaticCard(project, cardHash, projectConfig.timezone)
            CodeType.DYNAMIC ->
                card.totp != null &&
                    CardVerifier.verifyDynamicCard(project, cardHash, card.totp, projectConfig.timezone)
        }

        val verificationResult = CardVerificationResultModel(
            isValid,
            CardVerifier.isExtendable(project, cardHash),
        )

        Matomo.trackVerification(
            context.backendConfiguration,
            projectConfig,
            context.request,
            dfe.field.name,
            cardHash,
            card.codeType,
            verificationResult.valid,
        )
        return verificationResult
    }
}
