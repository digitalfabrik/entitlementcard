package app.ehrenamtskarte.backend.application.webservice.schema.create

import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable
import app.ehrenamtskarte.backend.application.webservice.utils.onlySelectedIsPresent
import com.expediagroup.graphql.generator.annotations.GraphQLDescription

enum class ApplicationType {
    FIRST_APPLICATION,
    RENEWAL_APPLICATION,
}

enum class BavariaCardType {
    BLUE,
    GOLDEN,
}

@GraphQLDescription(
    "An application for the Bayerische Ehrenamtskarte.\n" +
        "The field `cardType` specifies whether `blueCardEntitlement` or `goldenCardEntitlement` must be present/null.\n" +
        "The field `applicationType` must not be null if and only if `cardType` is BavariaCardType.BLUE.",
)
data class Application(
    val personalData: PersonalData,
    val cardType: BavariaCardType,
    val applicationType: ApplicationType?,
    val wantsDigitalCard: Boolean,
    val blueCardEntitlement: BlueCardEntitlement?,
    val goldenCardEntitlement: GoldenCardEntitlement?,
    val hasAcceptedPrivacyPolicy: Boolean,
    val givenInformationIsCorrectAndComplete: Boolean,
) : JsonFieldSerializable {
    private val entitlementByCardType = mapOf(
        BavariaCardType.BLUE to blueCardEntitlement,
        BavariaCardType.GOLDEN to goldenCardEntitlement,
    )

    init {
        if (!onlySelectedIsPresent(entitlementByCardType, cardType)) {
            throw IllegalArgumentException("The specified entitlement(s) do not match card type.")
        }
        if ((applicationType != null) != (cardType == BavariaCardType.BLUE)) {
            throw IllegalArgumentException("Application type must not be null if and only if card type is blue.")
        }
    }

    override fun toJsonField(): JsonField {
        return JsonField(
            name = "application",
            translations = mapOf("de" to ""),
            type = Type.Array,
            value = listOfNotNull(
                personalData.toJsonField(),
                JsonField(
                    name = "cardType",
                    translations = mapOf("de" to "Antrag auf"),
                    type = Type.String,
                    value = when (cardType) {
                        BavariaCardType.BLUE -> "Blaue Ehrenamtskarte"
                        BavariaCardType.GOLDEN -> "Goldene Ehrenamtskarte"
                    },
                ),
                applicationType?.let {
                    JsonField(
                        name = "applicationType",
                        translations = mapOf("de" to "Art des Antrags"),
                        type = Type.String,
                        value = when (applicationType) {
                            ApplicationType.FIRST_APPLICATION -> "Erstantrag"
                            ApplicationType.RENEWAL_APPLICATION -> "Verlängerungsantrag"
                        },
                    )
                },
                JsonField(
                    name = "wantsDigitalCard",
                    translations = mapOf("de" to "Ich beantrage neben der physischen auch die digitale Ehrenamtskarte"),
                    type = Type.Boolean,
                    value = wantsDigitalCard,
                ),
                entitlementByCardType[cardType]!!.toJsonField(),
                JsonField(
                    "hasAcceptedPrivacyPolicy",
                    mapOf("de" to "Ich erkläre mich damit einverstanden, dass meine Daten zum Zwecke der Antragsverarbeitung gespeichert werden und akzeptiere die Datenschutzerklärung"),
                    Type.Boolean,
                    hasAcceptedPrivacyPolicy,
                ),
                JsonField(
                    "givenInformationIsCorrectAndComplete",
                    mapOf("de" to "Ich versichere, dass alle angegebenen Informationen korrekt und vollständig sind"),
                    Type.Boolean,
                    givenInformationIsCorrectAndComplete,
                ),
            ),
        )
    }
}
