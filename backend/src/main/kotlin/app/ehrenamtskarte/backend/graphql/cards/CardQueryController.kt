package app.ehrenamtskarte.backend.graphql.cards

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.db.entities.CodeType
import app.ehrenamtskarte.backend.graphql.cards.types.CardVerificationModel
import app.ehrenamtskarte.backend.graphql.cards.types.CardVerificationResultModel
import app.ehrenamtskarte.backend.graphql.cards.utils.CardVerifier
import app.ehrenamtskarte.backend.shared.Matomo
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import jakarta.servlet.http.HttpServletRequest
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.stereotype.Controller
import java.util.Base64

@Controller
class CardQueryController(
    @Suppress("SpringJavaInjectionPointsAutowiringInspection")
    private val backendConfiguration: BackendConfiguration,
    private val request: HttpServletRequest,
) {
    @GraphQLDescription(
        "Returns whether there is a card in the given project with that hash registered for that this TOTP is currently valid, extendable and a timestamp of the last check",
    )
    @QueryMapping
    fun verifyCardInProjectV2(
        @Argument project: String,
        @Argument card: CardVerificationModel,
        dfe: DataFetchingEnvironment,
    ): CardVerificationResultModel {
        val projectConfig = backendConfiguration.getProjectConfig(project)
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
            backendConfiguration,
            projectConfig,
            request,
            dfe.field.name,
            cardHash,
            card.codeType,
            verificationResult.valid,
        )
        return verificationResult
    }
}
