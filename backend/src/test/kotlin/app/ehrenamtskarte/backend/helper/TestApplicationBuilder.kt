package app.ehrenamtskarte.backend.helper

import app.ehrenamtskarte.backend.application.webservice.schema.create.Address
import app.ehrenamtskarte.backend.application.webservice.schema.create.Application
import app.ehrenamtskarte.backend.application.webservice.schema.create.ApplicationDetails
import app.ehrenamtskarte.backend.application.webservice.schema.create.ApplicationType
import app.ehrenamtskarte.backend.application.webservice.schema.create.BavariaCardType
import app.ehrenamtskarte.backend.application.webservice.schema.create.BlueCardEntitlement
import app.ehrenamtskarte.backend.application.webservice.schema.create.BlueCardEntitlementType
import app.ehrenamtskarte.backend.application.webservice.schema.create.BlueCardWorkAtOrganizationsEntitlement
import app.ehrenamtskarte.backend.application.webservice.schema.create.Organization
import app.ehrenamtskarte.backend.application.webservice.schema.create.OrganizationContact
import app.ehrenamtskarte.backend.application.webservice.schema.create.PersonalData
import app.ehrenamtskarte.backend.application.webservice.schema.create.WorkAtOrganization
import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.DateInput
import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.EmailInput
import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.ShortTextInput

class TestApplicationBuilder {
    companion object {
        fun build(isAlreadyVerified: Boolean): Application {
            return Application(
                personalData = PersonalData(
                    forenames = ShortTextInput("John"),
                    surname = ShortTextInput("Doe"),
                    dateOfBirth = DateInput("1990-01-01"),
                    address = Address(
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
                applicationDetails = ApplicationDetails(
                    applicationType = ApplicationType.FIRST_APPLICATION,
                    cardType = BavariaCardType.BLUE,
                    givenInformationIsCorrectAndComplete = true,
                    hasAcceptedEmailUsage = true,
                    hasAcceptedPrivacyPolicy = true,
                    wantsDigitalCard = true,
                    wantsPhysicalCard = false,
                    blueCardEntitlement = BlueCardEntitlement(
                        juleicaEntitlement = null,
                        militaryReserveEntitlement = null,
                        workAtDepartmentEntitlement = null,
                        volunteerServiceEntitlement = null,
                        entitlementType = BlueCardEntitlementType.WORK_AT_ORGANIZATIONS,
                        workAtOrganizationsEntitlement = BlueCardWorkAtOrganizationsEntitlement(
                            list = listOf(
                                WorkAtOrganization(
                                    organization = Organization(
                                        address = Address(
                                            street = ShortTextInput("Example Street"),
                                            houseNumber = ShortTextInput("123"),
                                            postalCode = ShortTextInput("80331"),
                                            location = ShortTextInput("München"),
                                            country = ShortTextInput("Deutschland"),
                                            addressSupplement = null
                                        ),
                                        category = ShortTextInput("Sport"),
                                        contact = OrganizationContact(
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
