package app.ehrenamtskarte.backend.application.webservice.schema.create

import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable
import app.ehrenamtskarte.backend.application.webservice.utils.onlySelectedIsPresent
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidJsonException

data class ApplicationDetails(
    val cardType: BavariaCardType,
    val applicationType: ApplicationType?,
    val wantsDigitalCard: Boolean,
    val wantsPhysicalCard: Boolean,
    val blueCardEntitlement: BlueCardEntitlement?,
    val goldenCardEntitlement: GoldenCardEntitlement?,
    val hasAcceptedPrivacyPolicy: Boolean,
    val hasAcceptedEmailUsage: Boolean,
    val givenInformationIsCorrectAndComplete: Boolean
) : JsonFieldSerializable {
    private val entitlementByCardType: Map<BavariaCardType, JsonFieldSerializable?> = mapOf(
        BavariaCardType.BLUE to blueCardEntitlement,
        BavariaCardType.GOLDEN to goldenCardEntitlement
    )

    init {
        if (!onlySelectedIsPresent(entitlementByCardType, cardType)) {
            throw InvalidJsonException("The specified entitlement(s) do not match card type.")
        }
        if ((applicationType != null) != (cardType == BavariaCardType.BLUE)) {
            throw InvalidJsonException("Application type must not be null if and only if card type is blue.")
        }
        if (!wantsPhysicalCard && !wantsDigitalCard) {
            throw InvalidJsonException("Does not apply for a physical nor for a digital card.")
        }
        if (!hasAcceptedPrivacyPolicy) {
            throw InvalidJsonException("Has not accepted privacy policy.")
        }
        if (!givenInformationIsCorrectAndComplete) {
            throw InvalidJsonException("Has not confirmed that information is correct and complete.")
        }
    }

    override fun toJsonField(): JsonField {
        return JsonField(
            "applicationDetails",
            mapOf("de" to "Antragsdetails"),
            Type.Array,
            listOfNotNull(
                JsonField(
                    name = "cardType",
                    translations = mapOf("de" to "Antrag auf"),
                    type = Type.String,
                    value = when (cardType) {
                        BavariaCardType.BLUE -> "Blaue Ehrenamtskarte"
                        BavariaCardType.GOLDEN -> "Goldene Ehrenamtskarte"
                    }
                ),
                applicationType?.let {
                    JsonField(
                        name = "applicationType",
                        translations = mapOf("de" to "Art des Antrags"),
                        type = Type.String,
                        value = when (applicationType) {
                            ApplicationType.FIRST_APPLICATION -> "Erstantrag"
                            ApplicationType.RENEWAL_APPLICATION -> "Verlängerungsantrag"
                        }
                    )
                },
                JsonField(
                    name = "wantsDigitalCard",
                    translations = mapOf("de" to "Ich beantrage eine digitale Ehrenamtskarte"),
                    type = Type.Boolean,
                    value = wantsDigitalCard
                ),
                JsonField(
                    name = "wantsPhysicalCard",
                    translations = mapOf("de" to "Ich beantrage eine physische Ehrenamtskarte"),
                    type = Type.Boolean,
                    value = wantsPhysicalCard
                ),
                entitlementByCardType[cardType]!!.toJsonField(),
                JsonField(
                    "hasAcceptedPrivacyPolicy",
                    mapOf("de" to "Ich erkläre mich damit einverstanden, dass meine Daten zum Zwecke der Antragsverarbeitung gespeichert werden und akzeptiere die Datenschutzerklärung"),
                    Type.Boolean,
                    hasAcceptedPrivacyPolicy
                ),
                JsonField(
                    "hasAcceptedEmailUsage",
                    mapOf("de" to "Ich stimme zu, dass ich von der lokalen Ehrenamtskoordination über Verlosungen und regionale Angebote informiert werden darf"),
                    Type.Boolean,
                    hasAcceptedEmailUsage
                ),
                JsonField(
                    "givenInformationIsCorrectAndComplete",
                    mapOf("de" to "Ich versichere, dass alle angegebenen Informationen korrekt und vollständig sind"),
                    Type.Boolean,
                    givenInformationIsCorrectAndComplete
                )
            )
        )
    }
}
