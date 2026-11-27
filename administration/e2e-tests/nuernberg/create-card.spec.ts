import * as fs from 'fs/promises'

import { applicants } from '../shared/data/nuernberg-applicants'
import { expect, test } from '../shared/fixtures/nuernberg'
import { roles, testDoc, userManualTag } from '../shared/user-manual'
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

test.describe('Karten erstellen', () => {
  test.beforeEach(async ({ tenant, cardsAddPage, loginPage }) => {
    await loginPage.goto()
    await loginPage.login(tenant.credentials.regionAdmin)
    await cardsAddPage.openCardsFromDashboard()
    await cardsAddPage.openSingleCardCreation()
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

  test(
    'Karten erstellen und QR-Codes drucken',
    { tag: [userManualTag] },
    async ({ cardsAddPage }) => {
      testDoc.role(roles.regionAdmin)
      testDoc.role(roles.regionManager)
      testDoc.description(
        'Sie können eine oder mehrere Karten erstellen. Für jede Karte erzeugt das System ein PDF mit einem ' +
          'Aktivierungscode für die App und einem Nürnberg-Pass zum Ausschneiden.',
      )

      await cardsAddPage.fillCard(applicants.standard)
      await cardsAddPage.addCard(applicants.blockName)
      const download = await cardsAddPage.downloadPdf()

      await testDoc.result(
        'Das System erstellt die Karten und lädt ein PDF mit einer Seite pro Karte herunter.',
        async () => {
          expect(download.suggestedFilename()).toBe('berechtigungskarten.pdf')
          await verifyPassPdf(download, [
            { applicant: applicants.standard, snapshot: 'nina-nuernberg.png' },
            { applicant: applicants.blockName, snapshot: 'bao-blockname.png' },
          ])
        },
      )
    },
  )

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

  test(
    'Karten erstellen und als CSV exportieren',
    { tag: [userManualTag] },
    async ({ cardsAddPage }) => {
      testDoc.role(roles.regionAdmin)
      testDoc.role(roles.regionManager)
      testDoc.description(
        'Statt eines PDFs können Sie die Karten als CSV-Datei exportieren, z.B. um die Aktivierungscodes ' +
          'in einem anderen System weiterzuverarbeiten.',
      )

      await cardsAddPage.fillCard(applicants.standard)
      await cardsAddPage.addCard(applicants.blockName)
      const download = await cardsAddPage.downloadCsv()

      await testDoc.result(
        'Das System erstellt die Karten und lädt eine CSV-Datei mit einer Zeile pro Karte herunter.',
        async () => {
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
        },
      )
    },
  )
})
