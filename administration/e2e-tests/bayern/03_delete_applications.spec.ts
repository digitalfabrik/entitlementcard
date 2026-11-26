import { APIRequestContext, expect, test } from '@playwright/test'

const backendUrl = 'http://localhost:8000'

const address = {
  street: { shortText: 'street' },
  houseNumber: { shortText: '1' },
  postalCode: { shortText: '86150' },
  location: { shortText: 'Augsburg' },
  country: { shortText: 'Deutschland' },
}

/** Creates a pending application in the region "Augsburg (Stadt)" via the backend API. */
const createApplication = async (request: APIRequestContext, forenames: string) => {
  const response = await request.post(backendUrl, {
    data: {
      query:
        'mutation addEakApplication($regionId: Int!, $application: ApplicationInput!, $project: String!) { result: addEakApplication(regionId: $regionId, application: $application, project: $project) }',
      variables: {
        regionId: 9,
        project: 'bayern.ehrenamtskarte.app',
        application: {
          personalData: {
            forenames: { shortText: forenames },
            surname: { shortText: 'Doe' },
            address,
            dateOfBirth: { date: '1999-10-10' },
            emailAddress: { email: 'example@example.org' },
          },
          applicationDetails: {
            cardType: 'BLUE',
            applicationType: 'FIRST_APPLICATION',
            wantsDigitalCard: true,
            wantsPhysicalCard: false,
            hasAcceptedPrivacyPolicy: true,
            hasAcceptedEmailUsage: false,
            givenInformationIsCorrectAndComplete: true,
            blueCardEntitlement: {
              entitlementType: 'WORK_AT_DEPARTMENT',
              workAtDepartmentEntitlement: {
                responsibility: { shortText: 'activity' },
                organization: {
                  name: { shortText: 'organization' },
                  category: { shortText: 'Sport' },
                  address,
                  contact: {
                    name: { shortText: 'Contact' },
                    email: { email: 'contact@example.org' },
                    telephone: { shortText: '0123' },
                    hasGivenPermission: true,
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  expect(await response.json()).toEqual({ data: { result: true } })
}

test.describe('DeleteApplications', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Switch to Ehrenamtskarte' }).click()
    await page
      .getByRole('textbox', { name: 'Email-Adresse' })
      .fill('region-admin-augsburg@bayern.ehrenamtskarte.app')
    await page.getByPlaceholder('Passwort').fill('Administrator!')
    await page.getByRole('button', { name: 'Anmelden' }).click()
  })

  test('should reject and delete an application', async ({ page, request }) => {
    // Use a unique name, so the test does not depend on leftovers of previous runs
    const forenames = `delete-${Date.now()}`
    await createApplication(request, forenames)

    await page.getByRole('link', { name: 'Eingehende Anträge' }).nth(1).click()
    const application = page
      .locator('.MuiAccordion-root')
      .filter({ has: page.getByRole('heading', { name: `Doe, ${forenames}`, exact: true }) })
    await expect(application).toHaveCount(1)
    await application.click()

    // Pending applications have to be rejected before they can be deleted
    await application.getByRole('button', { name: 'Antrag ablehnen' }).click()
    await page.getByRole('dialog').getByRole('combobox', { name: 'Grund' }).click()
    await page
      .getByRole('option', { name: 'Anwartschaftszeit blau (2 Jahre) nicht erreicht', exact: true })
      .click()
    await page.getByRole('button', { name: 'Ablehnung bestätigen' }).click()

    await application.getByRole('button', { name: 'Antrag löschen' }).click()
    await page.getByRole('dialog').getByRole('button', { name: 'Bestätigen' }).click()
    await expect(page.getByRole('dialog')).toBeHidden()
    await expect(application).toHaveCount(0)
  })
})
