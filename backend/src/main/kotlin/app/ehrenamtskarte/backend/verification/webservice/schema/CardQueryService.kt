package app.ehrenamtskarte.backend.verification.webservice.schema

import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.verification.service.CardVerifier
import app.ehrenamtskarte.backend.verification.webservice.schema.types.CardVerificationModel
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.postgresql.util.Base64

@Suppress("unused")
class CardQueryService {
    @GraphQLDescription("Returns whether there is a card in the given project with that hash registered for that this TOTP is currently valid")
    fun verifyCardInProject(projectId: String, card: CardVerificationModel, dfe: DataFetchingEnvironment): Boolean {
        val context = dfe.getContext<GraphQLContext>()
        val project = context.backendConfiguration.projects.find { it.id == projectId } ?: return false
        return CardVerifier.verifyCardHash(projectId, Base64.decode(card.cardDetailsHashBase64), card.totp, project.timezone)
    }
}
