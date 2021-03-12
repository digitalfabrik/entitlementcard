package app.ehrenamtskarte.backend.application.webservice.schema

data class BlueEakCardApplication(
    val personalData: PersonalData,
    val applicationType: ApplicationType,
    val entitlement: BlueCardEntitlement,
    val hasAcceptedPrivacyPolicy: Boolean,
    val givenInformationIsCorrectAndComplete: Boolean
)

enum class BlueCardEntitlementType {
    JULEICA,
    SERVICE,
    STANDARD
}

data class BlueCardEntitlement(
    val blueEntitlementType: BlueCardEntitlementType,
    val juleicaNumber: String?,
    val juleicaExpirationDate: String?,
    val copyOfJuleica: Attachment?,
    val serviceActivity: BlueCardServiceEntitlementActivity?,
    val serviceCertificate: Attachment?,
    val workAtOrganizations: List<WorkAtOrganization>?
)

enum class BlueCardServiceEntitlementActivity {
    FIRE_DEPARTMENT,
    DISASTER_CONTROL,
    RESCUE_SERVICE
}

enum class ApplicationType {
    FIRST_APPLICATION,
    RENEWAL_APPLICATION
}
