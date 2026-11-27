import { NuernbergApplicant, applicants } from '../shared/data/nuernberg-applicants'
import { expect, test } from '../shared/fixtures/nuernberg'
import { prefilledCardParams, prefilledCardUrl } from '../shared/pages/cards-add.page'
import { roles, testDoc, userManualTag } from '../shared/user-manual'
import { normalizeNameForFilename, verifyPassPdf } from '../shared/utils'

// The file name of a single card contains the year it was created in
const currentYear = new Date().getFullYear()

// Supported query parameters, see extensionColumnNames in src/project-configs/nuernberg/config.ts
const parameterDescriptions: Record<string, { description: string; required: boolean }> = {
  Name: { description: 'Vor- und Nachname', required: true },
  Ablaufdatum: { description: 'Ende der Gültigkeit im Format TT.MM.JJJJ', required: true },
  Startdatum: { description: 'Beginn der Gültigkeit im Format TT.MM.JJJJ', required: true },
  Geburtsdatum: { description: 'Geburtsdatum im Format TT.MM.JJJJ', required: true },
  'Pass-ID': { description: 'Nummer des Nürnberg-Passes', required: true },
  'Adresszeile 1': { description: 'Straße und Hausnummer', required: false },
  'Adresszeile 2': { description: 'Adresszusatz, z.B. c/o', required: false },
  PLZ: { description: 'Postleitzahl (5 Ziffern)', required: false },
  Ort: { description: 'Wohnort', required: false },
}

/** Describes all query parameters of the link with the values of the applicant as examples */
const parameterTable = (applicant: NuernbergApplicant): string => {
  const params = prefilledCardParams(applicant)
  const rows = Object.entries(parameterDescriptions).map(
    ([name, { description, required }]) =>
      `| \`${name}\` | ${description} | ${required ? 'ja' : 'nein'} | ${params.get(name) || '–'} |`,
  )
  return [
    '| Parameter | Bedeutung | Pflicht | Beispiel |',
    '|-----------|-----------|---------|----------|',
    ...rows,
  ].join('\n')
}

test.describe('Karte über einen vorausgefüllten Link erstellen', () => {
  ;[
    { applicant: applicants.standard, snapshot: 'nina-nuernberg.png', userManual: false },
    // Contains all parameters, so it is used as example in the user manual
    { applicant: applicants.withAddress, snapshot: 'anna-anschrift.png', userManual: true },
    { applicant: applicants.blockName, snapshot: 'bao-blockname.png', userManual: false },
  ].forEach(({ applicant, snapshot, userManual }) => {
    // Only one of the variants is part of the user manual
    const title = userManual
      ? 'Karte über einen vorausgefüllten Link erstellen und drucken'
      : `should create card via prefilled URL with [${applicant.name}]`
    test(
      title,
      { tag: userManual ? [userManualTag] : [] },
      async ({ tenant, cardsAddPage, loginPage }) => {
        testDoc.role(roles.regionAdmin)
        testDoc.role(roles.regionManager)
        testDoc.description(
          'Andere Systeme können die Verwaltung über einen Link öffnen, der die Kartendaten bereits enthält. ' +
            'Sie müssen die Daten dann nur noch prüfen. Der Link enthält folgende Parameter:\n\n' +
            `${parameterTable(applicant)}\n\n` +
            'Sonderzeichen wie Leerzeichen und Umlaute müssen im Link kodiert sein. Beispiel:\n\n' +
            `\`\`\`\n${prefilledCardUrl(applicant)}\n\`\`\``,
        )

        await cardsAddPage.gotoPrefilledCard(applicant)
        await loginPage.login(tenant.credentials.regionAdmin)

        await expect(cardsAddPage.nameInput).toHaveValue(applicant.name)
        await expect(cardsAddPage.birthDateInput).toHaveValue(applicant.birthDate)
        await expect(cardsAddPage.startDateInput).toHaveValue(applicant.startDate)
        await expect(cardsAddPage.expiryDateInput).toHaveValue(applicant.expiryDate)
        await expect(cardsAddPage.passIdInput).toHaveValue(applicant.passId)

        const download = await cardsAddPage.downloadPdf()

        await testDoc.result(
          'Das System übernimmt die Daten aus dem Link in das Formular, erstellt die Karte und lädt das PDF herunter.',
          async () => {
            expect(download.suggestedFilename()).toBe(
              `Berechtigungskarte_${normalizeNameForFilename(applicant.name)}-${currentYear}.pdf`,
            )
            await verifyPassPdf(download, [{ applicant, snapshot }])
          },
        )
      },
    )
  })
})
