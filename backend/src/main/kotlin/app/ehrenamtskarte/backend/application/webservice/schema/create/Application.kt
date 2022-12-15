package app.ehrenamtskarte.backend.application.webservice.schema.create

import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable
import app.ehrenamtskarte.backend.application.webservice.utils.onlySelectedIsPresent
import com.expediagroup.graphql.generator.annotations.GraphQLDescription

enum class ApplicationType {
    FIRST_APPLICATION,
    RENEWAL_APPLICATION
}

enum class CardType {
    BLUE,
    GOLDEN
}

@GraphQLDescription(
    """
    An application for the Bayerische Ehrenamtskarte.
    The field `cardType` specifies whether `blueCardEntitlement` or `goldenCardEntitlement` can be null.
"""
)
data class Application(
    val personalData: PersonalData,
    val cardType: CardType,
    val applicationType: ApplicationType,
    val blueCardEntitlement: BlueCardEntitlement?,
    val goldenCardEntitlement: GoldenCardEntitlement?,
    val hasAcceptedPrivacyPolicy: Boolean,
    val givenInformationIsCorrectAndComplete: Boolean
) : JsonFieldSerializable {
    private val entitlementByCardType = mapOf(
        CardType.BLUE to blueCardEntitlement,
        CardType.GOLDEN to goldenCardEntitlement
    )

    init {
        if (!onlySelectedIsPresent(entitlementByCardType, cardType)) {
            throw IllegalArgumentException("The specified entitlement(s) do not match cardType")
        }
    }

    override fun toJsonField(): JsonField {
        return JsonField(
            name = "application",
            translations = mapOf("de" to "Antrag"),
            type = Type.Array,
            value = listOf(
                personalData.toJsonField(),
                JsonField(
                    name = "applicationType",
                    translations = mapOf("de" to "Antragstyp"),
                    type = Type.String,
                    value = when (applicationType) {
                        ApplicationType.FIRST_APPLICATION -> "Erstantrag"
                        ApplicationType.RENEWAL_APPLICATION -> "Verlängerungsantrag"
                    }
                ),
                entitlementByCardType[cardType]!!.toJsonField(),
                JsonField(
                    "hasAcceptedPrivacyPolicy",
                    mapOf("de" to "Ich habe die Richtlinien zum Datenschutz gelesen und akzeptiert"),
                    Type.Boolean,
                    hasAcceptedPrivacyPolicy
                ),
                JsonField(
                    "givenInformationIsCorrectAndComplete",
                    mapOf("de" to "Ich bestätige, dass die gegebenen Informationen korrekt und vollständig sind"),
                    Type.Boolean,
                    givenInformationIsCorrectAndComplete
                )
            )
        )
    }
}