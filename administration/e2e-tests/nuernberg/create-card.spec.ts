import * as fs from 'fs/promises'

import { applicants } from '../shared/data/nuernberg-applicants'
import { expect, test } from '../shared/fixtures/nuernberg'
import {
  CSV_HEADERS,
  normalizeNameForFilename,
  parseCsv,
  verifyCsvRow,
  verifyPassPdf,
  verifyUniqueGeneratedFields,
} from '../shared/utils'

// The file name of a single card contains the year it was created in
const currentYear = new Date().getFullYear()

test.describe('Create single cards', () => {
  test.beforeEach(async ({ tenant, cardsAddPage, loginPage }) => {
    await cardsAddPage.goto()
    await loginPage.login(tenant.credentials.regionAdmin)
  })

  ;[
    { applicant: applicants.standard, snapshot: 'nina-nuernberg.png' },
    { applicant: applicants.blockName, snapshot: 'bao-blockname.png' },
  ].forEach(({ applicant, snapshot }) => {
    test(`should create and download card with [${applicant.name}]`, async ({ cardsAddPage }) => {
      await cardsAddPage.fillCard(applicant)

      const download = await cardsAddPage.downloadPdf()
      expect(download.suggestedFilename()).toBe(
        `Berechtigungskarte_${normalizeNameForFilename(applicant.name)}-${currentYear}.pdf`,
      )
      await verifyPassPdf(download, [{ applicant, snapshot }])
    })
  })

  test('should create and download multiple cards', async ({ cardsAddPage }) => {
    await cardsAddPage.fillCard(applicants.standard)
    await cardsAddPage.addCard(applicants.blockName)

    const download = await cardsAddPage.downloadPdf()
    expect(download.suggestedFilename()).toBe('berechtigungskarten.pdf')
    await verifyPassPdf(download, [
      { applicant: applicants.standard, snapshot: 'nina-nuernberg.png' },
      { applicant: applicants.blockName, snapshot: 'bao-blockname.png' },
    ])
  })

  test('should export single card as CSV', async ({ cardsAddPage }) => {
    await cardsAddPage.fillCard(applicants.standard)

    const download = await cardsAddPage.downloadCsv()
    expect(download.suggestedFilename()).toBe(`${applicants.standard.passId}.csv`)

    const csvPath = await download.path()
    expect(csvPath).not.toBeNull()

    const content = await fs.readFile(csvPath!, 'utf-8')
    expect(content.trim().split(/\r?\n/)[0].split(',')).toEqual(CSV_HEADERS)

    const rows = parseCsv(content)
    expect(rows).toHaveLength(1)
    verifyCsvRow(rows[0], applicants.standard)
  })

  test('should export multiple cards as CSV', async ({ cardsAddPage }) => {
    await cardsAddPage.fillCard(applicants.standard)
    await cardsAddPage.addCard(applicants.blockName)

    const download = await cardsAddPage.downloadCsv()
    expect(download.suggestedFilename()).toBe('SozialpassMassExport.csv')

    const csvPath = await download.path()
    expect(csvPath).not.toBeNull()

    const rows = parseCsv(await fs.readFile(csvPath!, 'utf-8'))
    expect(rows).toHaveLength(2)

    const standardRow = rows.find(r => r.PassId === applicants.standard.passId)
    expect(standardRow).toBeDefined()
    verifyCsvRow(standardRow!, applicants.standard)

    const blockNameRow = rows.find(r => r.PassId === applicants.blockName.passId)
    expect(blockNameRow).toBeDefined()
    verifyCsvRow(blockNameRow!, applicants.blockName)

    verifyUniqueGeneratedFields(rows)
  })
})
