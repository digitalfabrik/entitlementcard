import * as fs from 'fs/promises'

import { applicants } from '../shared/data/nuernberg-applicants'
import { expect, test } from '../shared/fixtures/nuernberg'
import {
  CSV_HEADERS,
  parseCsv,
  verifyCsvRow,
  verifyPassPdf,
  verifyUniqueGeneratedFields,
} from '../shared/utils'

test.describe('Import cards', () => {
  test.beforeEach(async ({ tenant, loginPage, cardsImportPage }) => {
    await cardsImportPage.goto()
    await loginPage.login(tenant.credentials.regionAdmin)
  })

  test('should import and print cards from CSV', async ({ page, cardsImportPage }) => {
    await cardsImportPage.uploadCsv([
      applicants.standard,
      applicants.withAddress,
      applicants.blockName,
    ])

    const standardRow = page.getByRole('row').filter({ hasText: applicants.standard.name })
    await expect(standardRow).toContainText(
      [
        applicants.standard.name,
        applicants.standard.expiryDate,
        applicants.standard.startDate,
        applicants.standard.birthDate,
        applicants.standard.passId,
      ].join('\n'),
      { useInnerText: true },
    )

    const withAddressRow = page.getByRole('row').filter({ hasText: applicants.withAddress.name })
    await expect(withAddressRow).toContainText(
      [
        applicants.withAddress.name,
        applicants.withAddress.expiryDate,
        applicants.withAddress.startDate,
        applicants.withAddress.birthDate,
        applicants.withAddress.passId,
        applicants.withAddress.street1!,
        '-', // Adresszeile 2 is empty and shows a hyphen
        applicants.withAddress.postalCode!,
        applicants.withAddress.city!,
      ].join('\n'),
      { useInnerText: true },
    )

    const blockNameRow = page.getByRole('row').filter({ hasText: applicants.blockName.name })
    await expect(blockNameRow).toContainText(
      [
        applicants.blockName.name,
        applicants.blockName.expiryDate,
        applicants.blockName.startDate,
        applicants.blockName.birthDate,
        applicants.blockName.passId,
      ].join('\n'),
      { useInnerText: true },
    )

    const download = await cardsImportPage.downloadPdf()
    expect(download.suggestedFilename()).toBe('berechtigungskarten.pdf')
    await verifyPassPdf(download, [
      { applicant: applicants.standard, snapshot: 'nina-nuernberg.png' },
      { applicant: applicants.withAddress, snapshot: 'anna-anschrift.png' },
      { applicant: applicants.blockName, snapshot: 'bao-blockname.png' },
    ])
  })

  test('should export imported cards as CSV', async ({ cardsImportPage }) => {
    await cardsImportPage.uploadCsv([
      applicants.standard,
      applicants.withAddress,
      applicants.blockName,
    ])

    const download = await cardsImportPage.downloadCsv()
    expect(download.suggestedFilename()).toBe('SozialpassMassExport.csv')

    const csvPath = await download.path()
    expect(csvPath).not.toBeNull()

    const content = await fs.readFile(csvPath!, 'utf-8')
    expect(content.trim().split(/\r?\n/)[0].split(',')).toEqual(CSV_HEADERS)

    const rows = parseCsv(content)
    expect(rows).toHaveLength(3)

    const standardRow = rows.find(r => r.PassId === applicants.standard.passId)
    expect(standardRow).toBeDefined()
    verifyCsvRow(standardRow!, applicants.standard)

    const withAddressRow = rows.find(r => r.PassId === applicants.withAddress.passId)
    expect(withAddressRow).toBeDefined()
    verifyCsvRow(withAddressRow!, applicants.withAddress)

    const blockNameRow = rows.find(r => r.PassId === applicants.blockName.passId)
    expect(blockNameRow).toBeDefined()
    verifyCsvRow(blockNameRow!, applicants.blockName)

    verifyUniqueGeneratedFields(rows)
  })
})
