package app.ehrenamtskarte.backend.helper

import app.ehrenamtskarte.backend.generated.enums.ApplicationType
import app.ehrenamtskarte.backend.generated.enums.BavariaCardType
import app.ehrenamtskarte.backend.generated.enums.BlueCardEntitlementType
import app.ehrenamtskarte.backend.generated.inputs.AddressInput
import app.ehrenamtskarte.backend.generated.inputs.ApplicationDetailsInput
import app.ehrenamtskarte.backend.generated.inputs.ApplicationInput
import app.ehrenamtskarte.backend.generated.inputs.BlueCardEntitlementInput
import app.ehrenamtskarte.backend.generated.inputs.BlueCardWorkAtOrganizationsEntitlementInput
import app.ehrenamtskarte.backend.generated.inputs.DateInput
import app.ehrenamtskarte.backend.generated.inputs.EmailInput
import app.ehrenamtskarte.backend.generated.inputs.OrganizationContactInput
import app.ehrenamtskarte.backend.generated.inputs.OrganizationInput
import app.ehrenamtskarte.backend.generated.inputs.PersonalDataInput
import app.ehrenamtskarte.backend.generated.inputs.ShortTextInput
import app.ehrenamtskarte.backend.generated.inputs.WorkAtOrganizationInput

class TestApplicationBuilder {
    companion object {
        fun build(
            isAlreadyVerified: Boolean,
            applicationType: ApplicationType = ApplicationType.FIRST_APPLICATION,
            cardType: BavariaCardType = BavariaCardType.BLUE,
            wantsDigitalCard: Boolean = true,
            wantsPhysicalCard: Boolean = false,
            category: String = "Sport"
        ): ApplicationInput {
            return ApplicationInput(
                personalData = PersonalDataInput(
                    forenames = ShortTextInput("John"),
                    surname = ShortTextInput("Doe"),
                    dateOfBirth = DateInput("1990-01-01"),
                    address = AddressInput(
                        street = ShortTextInput("Example Street"),
                        houseNumber = ShortTextInput("123"),
                        postalCode = ShortTextInput("80331"),
                        addressSupplement = null,
                        location = ShortTextInput("München"),
                        country = ShortTextInput("Deutschland")
                    ),
                    telephone = ShortTextInput("123456789"),
                    emailAddress = EmailInput("johndoe@example.com")
                ),
                applicationDetails = ApplicationDetailsInput(
                    applicationType = applicationType,
                    cardType = cardType,
                    givenInformationIsCorrectAndComplete = true,
                    hasAcceptedEmailUsage = true,
                    hasAcceptedPrivacyPolicy = true,
                    wantsDigitalCard = wantsDigitalCard,
                    wantsPhysicalCard = wantsPhysicalCard,
                    blueCardEntitlement = BlueCardEntitlementInput(
                        juleicaEntitlement = null,
                        militaryReserveEntitlement = null,
                        workAtDepartmentEntitlement = null,
                        volunteerServiceEntitlement = null,
                        entitlementType = BlueCardEntitlementType.WORK_AT_ORGANIZATIONS,
                        workAtOrganizationsEntitlement = BlueCardWorkAtOrganizationsEntitlementInput(
                            list = listOf(
                                WorkAtOrganizationInput(
                                    organization = OrganizationInput(
                                        address = AddressInput(
                                            street = ShortTextInput("Example Street"),
                                            houseNumber = ShortTextInput("123"),
                                            postalCode = ShortTextInput("80331"),
                                            location = ShortTextInput("München"),
                                            country = ShortTextInput("Deutschland"),
                                            addressSupplement = null
                                        ),
                                        category = ShortTextInput(category),
                                        contact = OrganizationContactInput(
                                            name = ShortTextInput("Jane Doe"),
                                            email = EmailInput("jane.doe@sportverein.de"),
                                            telephone = ShortTextInput("0150123456789"),
                                            hasGivenPermission = true
                                        ),
                                        name = ShortTextInput("Sportverein Augsburg-Nord")
                                    ),
                                    amountOfWork = 7.5,
                                    responsibility = ShortTextInput("Trainer"),
                                    workSinceDate = DateInput("2020-10-06"),
                                    payment = false,
                                    certificate = null,
                                    isAlreadyVerified = isAlreadyVerified
                                )
                            )
                        )
                    ),
                    goldenCardEntitlement = null
                )
            )
        }
    }
}
