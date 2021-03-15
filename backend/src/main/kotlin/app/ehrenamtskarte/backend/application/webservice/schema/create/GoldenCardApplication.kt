package app.ehrenamtskarte.backend.application.webservice.schema.create

import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable

data class GoldenEakCardApplication(
    val personalData: PersonalData,
    val entitlement: GoldenCardEntitlement,
    val hasAcceptedPrivacyPolicy: Boolean,
    val givenInformationIsCorrectAndComplete: Boolean
) : JsonFieldSerializable {
    override fun toJsonField(): JsonField {
        TODO("Not yet implemented")
    }
}

enum class GoldenCardEntitlementType {
    SERVICE_AWARD,
    STANDARD,
    HONOR_BY_MINISTER_PRESIDENT
}

data class GoldenCardEntitlement(
    val goldenEntitlementType: GoldenCardEntitlementType,
    val certificate: Attachment?,
    val workAtOrganizations: List<WorkAtOrganization>?
)
