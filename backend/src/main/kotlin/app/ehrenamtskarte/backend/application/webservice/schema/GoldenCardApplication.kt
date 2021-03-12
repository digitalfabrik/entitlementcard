package app.ehrenamtskarte.backend.application.webservice.schema

data class GoldenEakCardApplication(
    val personalData: PersonalData,
    val entitlement: GoldenCardEntitlement,
    val hasAcceptedPrivacyPolicy: Boolean,
    val givenInformationIsCorrectAndComplete: Boolean
)

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
