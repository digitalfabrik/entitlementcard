import { applicants } from '../shared/data/nuernberg-applicants'
import { expect, test } from '../shared/fixtures/nuernberg'
import { normalizeNameForFilename, verifyPassPdf } from '../shared/utils'

// The file name of a single card contains the year it was created in
const currentYear = new Date().getFullYear()

test.describe('Create single cards via prefilled URL', () => {
  ;[
    { applicant: applicants.standard, snapshot: 'nina-nuernberg.png' },
    { applicant: applicants.withAddress, snapshot: 'anna-anschrift.png' },
    { applicant: applicants.blockName, snapshot: 'bao-blockname.png' },
  ].forEach(({ applicant, snapshot }) => {
    test(`should create card via prefilled URL with [${applicant.name}]`, async ({
      tenant,
      cardsAddPage,
      loginPage,
    }) => {
      await cardsAddPage.gotoPrefilledCard(applicant)
      await loginPage.login(tenant.credentials.regionAdmin)

      await expect(cardsAddPage.nameInput).toHaveValue(applicant.name)
      await expect(cardsAddPage.birthDateInput).toHaveValue(applicant.birthDate)
      await expect(cardsAddPage.startDateInput).toHaveValue(applicant.startDate)
      await expect(cardsAddPage.expiryDateInput).toHaveValue(applicant.expiryDate)
      await expect(cardsAddPage.passIdInput).toHaveValue(applicant.passId)

      const download = await cardsAddPage.downloadPdf()
      expect(download.suggestedFilename()).toBe(
        `Berechtigungskarte_${normalizeNameForFilename(applicant.name)}-${currentYear}.pdf`,
      )
      await verifyPassPdf(download, [{ applicant, snapshot }])
    })
  })
})
