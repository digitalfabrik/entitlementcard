package app.ehrenamtskarte.backend.verification.webservice.schema

import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.exception.service.ProjectNotFoundException
import app.ehrenamtskarte.backend.verification.database.CodeType
import app.ehrenamtskarte.backend.verification.service.CardVerifier
import app.ehrenamtskarte.backend.verification.webservice.schema.types.CardVerificationModel
import app.ehrenamtskarte.backend.verification.webservice.schema.types.CardVerificationResultModel
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import java.time.Instant
import java.util.Base64

@Suppress("unused")
class CardQueryService {
    @GraphQLDescription("Returns whether there is a card in the given project with that hash registered for that this TOTP is currently valid and a timestamp of the last check")
    fun verifyCardInProject(project: String, card: CardVerificationModel, dfe: DataFetchingEnvironment): CardVerificationResultModel {
        val context = dfe.getContext<GraphQLContext>()
        val projectConfig = context.backendConfiguration.projects.find { it.id == project } ?: throw ProjectNotFoundException(project)
        val cardHash = Base64.getDecoder().decode(card.cardInfoHashBase64)
        val timestamp = Instant.now().toString()

        if (card.codeType == CodeType.STATIC) {
            return CardVerificationResultModel(card.totp == null && CardVerifier.verifyStaticCard(project, cardHash, projectConfig.timezone), timestamp)
        } else if (card.codeType == CodeType.DYNAMIC) {
            return CardVerificationResultModel(card.totp != null && CardVerifier.verifyDynamicCard(project, cardHash, card.totp, projectConfig.timezone), timestamp)
        }
        return CardVerificationResultModel(false, timestamp)
    }
}
