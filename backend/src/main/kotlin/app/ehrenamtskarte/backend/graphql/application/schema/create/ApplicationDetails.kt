package app.ehrenamtskarte.backend.graphql.application.schema.create

import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidJsonException
import app.ehrenamtskarte.backend.graphql.application.schema.view.JsonField
import app.ehrenamtskarte.backend.graphql.application.schema.view.Type
import app.ehrenamtskarte.backend.graphql.application.utils.JsonFieldSerializable
import app.ehrenamtskarte.backend.graphql.application.utils.onlySelectedIsPresent

data class ApplicationDetails(
    val cardType: BavariaCardType,
    val applicationType: ApplicationType?,
    val wantsDigitalCard: Boolean,
    val wantsPhysicalCard: Boolean,
    val blueCardEntitlement: BlueCardEntitlement?,
    val goldenCardEntitlement: GoldenCardEntitlement?,
    val hasAcceptedPrivacyPolicy: Boolean,
    val hasAcceptedEmailUsage: Boolean,
    val givenInformationIsCorrectAndComplete: Boolean,
) : JsonFieldSerializable {
    private val entitlementByCardType: Map<BavariaCardType, JsonFieldSerializable?> = mapOf(
        BavariaCardType.BLUE to blueCardEntitlement,
        BavariaCardType.GOLDEN to goldenCardEntitlement,
    )

    init {
        if (!onlySelectedIsPresent(entitlementByCardType, cardType)) {
            throw InvalidJsonException("The specified entitlement(s) do not match card type.")
        }
        if ((applicationType != null) != (cardType == BavariaCardType.BLUE)) {
            throw InvalidJsonException(
                "Application type must not be null if and only if card type is blue.",
            )
        }
        if (!wantsPhysicalCard && !wantsDigitalCard) {
            throw InvalidJsonException("Does not apply for a physical nor for a digital card.")
        }
        if (!hasAcceptedPrivacyPolicy) {
            throw InvalidJsonException("Has not accepted privacy policy.")
        }
        if (!givenInformationIsCorrectAndComplete) {
            throw InvalidJsonException(
                "Has not confirmed that information is correct and complete.",
            )
        }
    }

    override fun toJsonField(): JsonField =
        JsonField(
            "applicationDetails",
            Type.Array,
            listOfNotNull(
                JsonField(
                    name = "cardType",
                    type = Type.String,
                    value = when (cardType) {
                        BavariaCardType.BLUE -> "Blaue Ehrenamtskarte"
                        BavariaCardType.GOLDEN -> "Goldene Ehrenamtskarte"
                    },
                ),
                applicationType?.let {
                    JsonField(
                        name = "applicationType",
                        type = Type.String,
                        value = when (applicationType) {
                            ApplicationType.FIRST_APPLICATION -> "Erstantrag"
                            ApplicationType.RENEWAL_APPLICATION -> "Verlängerungsantrag"
                        },
                    )
                },
                JsonField(
                    name = "wantsDigitalCard",
                    type = Type.Boolean,
                    value = wantsDigitalCard,
                ),
                JsonField(
                    name = "wantsPhysicalCard",
                    type = Type.Boolean,
                    value = wantsPhysicalCard,
                ),
                entitlementByCardType[cardType]!!.toJsonField(),
                JsonField(
                    "hasAcceptedPrivacyPolicy",
                    Type.Boolean,
                    hasAcceptedPrivacyPolicy,
                ),
                JsonField(
                    "hasAcceptedEmailUsage",
                    Type.Boolean,
                    hasAcceptedEmailUsage,
                ),
                JsonField(
                    "givenInformationIsCorrectAndComplete",
                    Type.Boolean,
                    givenInformationIsCorrectAndComplete,
                ),
            ),
        )
}
