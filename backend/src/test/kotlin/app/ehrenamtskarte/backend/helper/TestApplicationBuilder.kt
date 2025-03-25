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

object TestApplicationBuilder {

    fun default() = build(isAlreadyVerified = false)

    fun defaultVerified() = build(isAlreadyVerified = true)

    fun build(
        isAlreadyVerified: Boolean,
        applicationType: ApplicationType = ApplicationType.FIRST_APPLICATION,
        cardType: BavariaCardType = BavariaCardType.BLUE,
        wantsDigitalCard: Boolean = true,
        wantsPhysicalCard: Boolean = false,
        category: String = "sports",
        forenames: String = "John",
        surname: String = "Doe",
        givenInformationIsCorrectAndComplete: Boolean = true,
        contactName: String = "Jane Doe"
    ) = ApplicationInput(
        personalData = createPersonalData(forenames, surname),
        applicationDetails = createApplicationDetails(
            isAlreadyVerified,
            applicationType,
            cardType,
            wantsDigitalCard,
            wantsPhysicalCard,
            category,
            givenInformationIsCorrectAndComplete,
            contactName
        )
    )

    private fun createPersonalData(forenames: String, surname: String) = PersonalDataInput(
        forenames = ShortTextInput(forenames),
        surname = ShortTextInput(surname),
        dateOfBirth = DateInput("1990-01-01"),
        address = createAddress(),
        telephone = ShortTextInput("123456789"),
        emailAddress = EmailInput("johndoe@example.com")
    )

    private fun createApplicationDetails(
        isAlreadyVerified: Boolean,
        applicationType: ApplicationType,
        cardType: BavariaCardType,
        wantsDigitalCard: Boolean,
        wantsPhysicalCard: Boolean,
        category: String,
        givenInformationIsCorrectAndComplete: Boolean,
        contactName: String
    ) = ApplicationDetailsInput(
        applicationType = applicationType,
        cardType = cardType,
        givenInformationIsCorrectAndComplete = givenInformationIsCorrectAndComplete,
        hasAcceptedEmailUsage = true,
        hasAcceptedPrivacyPolicy = true,
        wantsDigitalCard = wantsDigitalCard,
        wantsPhysicalCard = wantsPhysicalCard,
        blueCardEntitlement = createBlueCardEntitlement(isAlreadyVerified, category, contactName)
    )

    private fun createBlueCardEntitlement(isAlreadyVerified: Boolean, category: String, contactName: String) =
        BlueCardEntitlementInput(
            entitlementType = BlueCardEntitlementType.WORK_AT_ORGANIZATIONS,
            workAtOrganizationsEntitlement = BlueCardWorkAtOrganizationsEntitlementInput(
                list = listOf(
                    WorkAtOrganizationInput(
                        organization = createOrganization(category, contactName),
                        amountOfWork = 7.5,
                        responsibility = ShortTextInput("Trainer"),
                        workSinceDate = DateInput("2020-10-06"),
                        payment = false,
                        certificate = null,
                        isAlreadyVerified = isAlreadyVerified
                    )
                )
            )
        )

    private fun createOrganization(category: String, contactName: String) = OrganizationInput(
        address = createAddress(),
        category = ShortTextInput(category),
        contact = createContact(contactName),
        name = ShortTextInput("Sportverein Augsburg-Nord")
    )

    private fun createContact(name: String) = OrganizationContactInput(
        name = ShortTextInput(name),
        email = EmailInput("jane.doe@sportverein.de"),
        telephone = ShortTextInput("0150123456789"),
        hasGivenPermission = true
    )

    private fun createAddress() = AddressInput(
        street = ShortTextInput("Example Street"),
        houseNumber = ShortTextInput("123"),
        postalCode = ShortTextInput("80331"),
        addressSupplement = null,
        location = ShortTextInput("München"),
        country = ShortTextInput("Deutschland")
    )
}
