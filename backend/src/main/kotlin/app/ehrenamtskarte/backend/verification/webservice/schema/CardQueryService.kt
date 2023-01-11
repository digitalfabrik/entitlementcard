package app.ehrenamtskarte.backend.verification.webservice.schema

import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.verification.service.CardVerifier
import app.ehrenamtskarte.backend.verification.webservice.schema.types.CardVerificationModel
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import java.util.Base64

@Suppress("unused")
class CardQueryService {
    @GraphQLDescription("Returns whether there is a card in the given project with that hash registered for that this TOTP is currently valid")
    fun verifyCardInProject(project: String, card: CardVerificationModel, dfe: DataFetchingEnvironment): Boolean {
        val context = dfe.getContext<GraphQLContext>()
        val projectConfig = context.backendConfiguration.projects.find { it.id == project } ?: throw NullPointerException("Project not found")
        return CardVerifier.verifyCardHash(project, Base64.getDecoder().decode(card.cardDetailsHashBase64), card.totp, projectConfig.timezone)
    }
}
