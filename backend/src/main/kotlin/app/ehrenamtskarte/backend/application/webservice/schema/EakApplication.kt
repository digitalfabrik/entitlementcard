package app.ehrenamtskarte.backend.application.webservice.schema


data class PersonalEakApplication(
    val personalDetails: PersonalDetails,
    val applicationDetails: PersonalApplicationDetails
)

interface PersonalApplicationDetails {

}

enum class ApplicationType {
    firstApplication,
    renewalApplication
}

data class BlueCardApplicationDetails(
    val applicationType: ApplicationType

) : PersonalApplicationDetails

data class GoldenCardApplicationDetails(
    val isHero: Boolean
) : PersonalApplicationDetails
