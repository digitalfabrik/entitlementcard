package app.ehrenamtskarte.backend.application.webservice.schema

import com.expediagroup.graphql.annotations.GraphQLDescription


data class PersonalEakApplication(
    val personalDetails: PersonalDetails,
    val applicationDetails: PersonalApplicationDetails,
    val hasAcceptedPrivacyPolicy: Boolean,
    val givenInformationIsCorrectAndComplete: Boolean
)

interface PersonalApplicationDetails

enum class ApplicationType {
    firstApplication,
    renewalApplication
}

interface BlueCardEntitlement

data class BlueCardJuleicaEntitlement(
    val cardNumber: String,
    val cardExpirationDate: String,
    val copyOfCard: Attachment
) : BlueCardEntitlement


enum class BlueCardServiceEntitlementActivity {
    fireDeparment,
    disasterControl,
    rescueService
}

/** Feuerwehr, Katastrophenschutz, Rettungsdienst mit Grundausbildung */
data class BlueCardServiceEntitlement(
    val activity: BlueCardServiceEntitlementActivity,
    val certificate: Attachment
) : BlueCardEntitlement

enum class AmountOfWorkUnit {
    hoursPerWeek,
    hoursPerYear
}

data class WorkAtOrganization(
    val organization: Organization,
    val amountOfWork: Double,
    val amountOfWorkUnit: AmountOfWorkUnit,
    val certificate: Attachment
)

data class BlueCardStandardEntitlement(
    val workAtOrganizations: List<WorkAtOrganization>
) : BlueCardEntitlement

data class BlueCardApplicationDetails(
    val applicationType: ApplicationType,
    val entitlement: BlueCardEntitlement
) : PersonalApplicationDetails


interface GoldenCardEntitlement

@GraphQLDescription("Inhaber:in des Ehrenzeichens des Bayerischen Ministerpräsidenten")
data class GoldenCardHonorByMinisterPresidentEntitlement(
    val certificate: Attachment
) : GoldenCardEntitlement

@GraphQLDescription(
    "Inhaber:in einer Dienstauszeichnung des Freistaats Bayern"
            + " nach Feuer- und Hilfsorganisationen-Ehrenzeichengesetz"
)
data class GoldenCardServiceAwardEntitlement(
    val certificate: Attachment
) : GoldenCardEntitlement

data class GoldenCardStandardEntitlement(
    val workAtOrganizations: List<WorkAtOrganization>
) : GoldenCardEntitlement

data class GoldenCardApplicationDetails(
    val entitlement: GoldenCardEntitlement
) : PersonalApplicationDetails
