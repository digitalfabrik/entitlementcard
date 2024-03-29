package app.ehrenamtskarte.backend.verification.webservice.schema

import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.exception.service.ProjectNotFoundException
import app.ehrenamtskarte.backend.matomo.Matomo
import app.ehrenamtskarte.backend.verification.database.CodeType
import app.ehrenamtskarte.backend.verification.service.CardVerifier
import app.ehrenamtskarte.backend.verification.webservice.schema.types.CardVerificationModel
import app.ehrenamtskarte.backend.verification.webservice.schema.types.CardVerificationResultModel
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import java.util.Base64

@Suppress("unused")
class CardQueryService {
    @Deprecated("Deprecated since May 2023 in favor of CardVerificationResultModel that return a current timestamp", ReplaceWith("verifyCardInProjectV2"))
    @GraphQLDescription("Returns whether there is a card in the given project with that hash registered for that this TOTP is currently valid and a timestamp of the last check")
    fun verifyCardInProject(project: String, card: CardVerificationModel, dfe: DataFetchingEnvironment): Boolean {
        val context = dfe.getContext<GraphQLContext>()
        val projectConfig = context.backendConfiguration.projects.find { it.id == project } ?: throw ProjectNotFoundException(project)
        val cardHash = Base64.getDecoder().decode(card.cardInfoHashBase64)
        var verificationResult = false

        if (card.codeType == CodeType.STATIC) {
            verificationResult = card.totp == null && CardVerifier.verifyStaticCard(project, cardHash, projectConfig.timezone)
        } else if (card.codeType == CodeType.DYNAMIC) {
            verificationResult = card.totp != null && CardVerifier.verifyDynamicCard(project, cardHash, card.totp, projectConfig.timezone)
        }
        Matomo.trackVerification(projectConfig, context.request, dfe.field.name, cardHash, card.codeType, verificationResult)
        return false
    }

    @GraphQLDescription("Returns whether there is a card in the given project with that hash registered for that this TOTP is currently valid and a timestamp of the last check")
    fun verifyCardInProjectV2(project: String, card: CardVerificationModel, dfe: DataFetchingEnvironment): CardVerificationResultModel {
        val context = dfe.getContext<GraphQLContext>()
        val projectConfig = context.backendConfiguration.projects.find { it.id == project } ?: throw ProjectNotFoundException(project)
        val cardHash = Base64.getDecoder().decode(card.cardInfoHashBase64)
        var verificationResult = CardVerificationResultModel(false)

        if (card.codeType == CodeType.STATIC) {
            verificationResult = CardVerificationResultModel(card.totp == null && CardVerifier.verifyStaticCard(project, cardHash, projectConfig.timezone))
        } else if (card.codeType == CodeType.DYNAMIC) {
            verificationResult = CardVerificationResultModel(card.totp != null && CardVerifier.verifyDynamicCard(project, cardHash, card.totp, projectConfig.timezone))
        }
        Matomo.trackVerification(projectConfig, context.request, dfe.field.name, cardHash, card.codeType, verificationResult.valid)
        return verificationResult
    }
}
