import { APIRequestContext, expect } from '@playwright/test'

import { roles, step, test, testDoc, userManualTag } from '../shared/user-manual'

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

test.describe('Anträge bearbeiten', () => {
  test.beforeEach(async ({ page }) => {
    await step('Öffnen Sie die Verwaltung im Browser.', async () => {
      await page.goto('/')
    })
    await page.getByRole('button', { name: 'Switch to Ehrenamtskarte' }).click()
    await step(
      'Geben Sie Ihre **Email-Adresse** und Ihr **Passwort** ein und klicken Sie auf **Anmelden**.',
      async () => {
        await page
          .getByRole('textbox', { name: 'Email-Adresse' })
          .fill('region-admin-augsburg@bayern.ehrenamtskarte.app')
        await page.getByPlaceholder('Passwort').fill('Administrator!')
        await page.getByRole('button', { name: 'Anmelden' }).click()
      },
    )
  })

  test('Antrag ablehnen und löschen', { tag: [userManualTag] }, async ({ page, request }) => {
    testDoc.role(roles.regionAdmin)
    testDoc.role(roles.regionManager)
    testDoc.description(
      'Unter **Eingehende Anträge** sehen Sie alle Anträge Ihrer Region. Offene Anträge müssen Sie ablehnen, ' +
        'bevor Sie sie löschen können. Abgelehnte und zurückgezogene Anträge können Sie direkt löschen.',
    )

    // Use a unique name, so the test does not depend on leftovers of previous runs
    const forenames = `delete-${Date.now()}`
    await testDoc.setup('Antrag für den Test anlegen', () => createApplication(request, forenames))
    const application = page
      .locator('.MuiAccordion-root')
      .filter({ has: page.getByRole('heading', { name: `Doe, ${forenames}`, exact: true }) })

    await step('Klicken Sie auf **Eingehende Anträge**.', () =>
      page.getByRole('link', { name: 'Eingehende Anträge' }).nth(1).click(),
    )
    await expect(application).toHaveCount(1)
    await step('Klicken Sie auf den Antrag, um alle Angaben anzuzeigen.', () => application.click())

    await step(
      'Klicken Sie auf **Antrag ablehnen**, wählen Sie unter **Grund** einen Ablehnungsgrund aus und klicken ' +
        'Sie auf **Ablehnung bestätigen**.',
      async () => {
        await testDoc.note(
          'Die antragstellende Person wird per E-Mail über die Ablehnung informiert.',
        )
        await application.getByRole('button', { name: 'Antrag ablehnen' }).click()
        await page.getByRole('dialog').getByRole('combobox', { name: 'Grund' }).click()
        await page
          .getByRole('option', {
            name: 'Anwartschaftszeit blau (2 Jahre) nicht erreicht',
            exact: true,
          })
          .click()
        await page.getByRole('button', { name: 'Ablehnung bestätigen' }).click()
      },
    )

    await step(
      'Klicken Sie auf **Antrag löschen** und bestätigen Sie mit **Bestätigen**.',
      async () => {
        await application.getByRole('button', { name: 'Antrag löschen' }).click()
        await page.getByRole('dialog').getByRole('button', { name: 'Bestätigen' }).click()
      },
    )

    await testDoc.result(
      'Das System löscht den Antrag und entfernt ihn aus der Liste.',
      async () => {
        await expect(page.getByRole('dialog')).toBeHidden()
        await expect(application).toHaveCount(0)
      },
    )
  })
})
