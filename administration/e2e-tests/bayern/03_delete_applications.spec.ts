import { APIRequestContext, expect } from '@playwright/test'

import { ApplicantName, deletedApplicant, displayName } from '../shared/data/bayern-applicants'
import { LoginPage } from '../shared/pages'
import { roles, step, test, testDoc, userManualTag } from '../shared/user-manual'
import { closeToasts } from '../shared/utils'

const backendUrl = 'http://localhost:8000'

const address = {
  street: { shortText: 'street' },
  houseNumber: { shortText: '1' },
  postalCode: { shortText: '86150' },
  location: { shortText: 'Augsburg' },
  country: { shortText: 'Deutschland' },
}

/** Creates a pending application in the region "Augsburg (Stadt)" via the backend API. */
const createApplication = async (request: APIRequestContext, name: ApplicantName) => {
  const response = await request.post(backendUrl, {
    data: {
      query:
        'mutation addEakApplication($regionId: Int!, $application: ApplicationInput!, $project: String!) { result: addEakApplication(regionId: $regionId, application: $application, project: $project) }',
      variables: {
        regionId: 9,
        project: 'bayern.ehrenamtskarte.app',
        application: {
          personalData: {
            forenames: { shortText: name.forenames },
            surname: { shortText: name.surname },
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
    await step('Öffnen Sie die Verwaltung im Browser.', () => page.goto('/'), { screenshot: false })
    await page.getByRole('button', { name: 'Switch to Ehrenamtskarte' }).click()
    await new LoginPage(page).login({
      email: 'region-admin-augsburg@bayern.ehrenamtskarte.app',
      password: 'Administrator!',
    })
  })

  test('Antrag ablehnen und löschen', { tag: [userManualTag] }, async ({ page, request }) => {
    testDoc.role(roles.regionAdmin)
    testDoc.role(roles.regionManager)
    testDoc.description(
      'Unter **Eingehende Anträge** sehen Sie alle Anträge Ihrer Region. Offene Anträge müssen Sie ablehnen, ' +
        'bevor Sie sie löschen können. Abgelehnte und zurückgezogene Anträge können Sie direkt löschen.',
    )

    await testDoc.setup('Antrag für den Test anlegen', () =>
      createApplication(request, deletedApplicant),
    )
    const application = page.locator('.MuiAccordion-root').filter({
      has: page.getByRole('heading', { name: displayName(deletedApplicant), exact: true }),
    })

    const applicationsLink = page.getByRole('link', { name: 'Eingehende Anträge' }).nth(1)
    await step('Klicken Sie auf **Eingehende Anträge**.', () => applicationsLink.click(), {
      focus: applicationsLink,
    })
    await expect(application).toHaveCount(1)
    await step(
      'Klicken Sie auf den Antrag, um alle Angaben anzuzeigen.',
      () => application.click(),
      {
        focus: application,
      },
    )

    const rejectButton = application.getByRole('button', { name: 'Antrag ablehnen' })

    await step(
      'Klicken Sie auf **Antrag ablehnen**, wählen Sie unter **Grund** einen Ablehnungsgrund aus und klicken ' +
        'Sie auf **Ablehnung bestätigen**.',
      async () => {
        await testDoc.note(
          'Die antragstellende Person wird per E-Mail über die Ablehnung informiert.',
        )
        await rejectButton.click()
        await page.getByRole('dialog').getByRole('combobox', { name: 'Grund' }).click()
        await page
          .getByRole('option', {
            name: 'Anwartschaftszeit blau (2 Jahre) nicht erreicht',
            exact: true,
          })
          .click()
        await page.getByRole('button', { name: 'Ablehnung bestätigen' }).click()
      },
      { focus: rejectButton },
    )
    // The toast of the rejection would cover the screenshot of the next step
    await expect(
      page.getByRole('alert').filter({ hasText: 'Der Antrag wurde abgelehnt.' }),
    ).toBeVisible()
    await closeToasts(page)

    const deleteButton = application.getByRole('button', { name: 'Antrag löschen' })

    await step(
      'Klicken Sie auf **Antrag löschen** und bestätigen Sie mit **Bestätigen**.',
      async () => {
        await deleteButton.click()
        await page.getByRole('dialog').getByRole('button', { name: 'Bestätigen' }).click()
      },
      { focus: deleteButton },
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
