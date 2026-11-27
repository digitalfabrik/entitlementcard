import { applicants } from '../shared/data/koblenz-applicants'
import { expect, test } from '../shared/fixtures/koblenz'
import { testDoc, userManualTag } from '../shared/user-manual'
import { verifyKoblenzPdf } from '../shared/utils'

test.describe('KoblenzPass selbst erstellen', () => {
  test.beforeEach(async ({ selfServicePage }) => {
    await selfServicePage.goto()
  })

  test(
    'KoblenzPass erstellen und aktivieren',
    { tag: [userManualTag] },
    async ({ selfServicePage }) => {
      testDoc.description(
        'Berechtigte können ihren KoblenzPass ohne Anmeldung selbst erstellen. Das System prüft die Angaben ' +
          'gegen die Daten des Jobcenters. Ist die Berechtigung abgelaufen oder widerrufen, erscheint die Meldung ' +
          '**Sie sind nicht länger berechtigt, einen KoblenzPass zu erstellen.** Findet das System die Angaben ' +
          'nicht, erscheint **Wir konnten Ihre Angaben nicht im System finden.**',
      )
      await expect(selfServicePage.welcomeHeading).toBeVisible()

      await selfServicePage.fillCard(applicants.standard)
      await selfServicePage.submit()

      await expect(selfServicePage.cardCreatedHeading).toBeVisible()
      await selfServicePage.proceed()

      await expect(selfServicePage.activationHeading).toBeVisible()
      const href = await selfServicePage.activationLink.getAttribute('href')
      const download = await selfServicePage.downloadPdf()

      await testDoc.result(
        'Das System zeigt die Schaltfläche **KoblenzPass jetzt aktivieren** an, mit der Sie den Pass in der ' +
          'App aktivieren. Das PDF enthält den Aktivierungscode, mit dem Sie den Pass auch später oder auf ' +
          'einem anderen Gerät aktivieren können.',
        async () => {
          expect(href).toMatch(/^koblenzpass:\/\/koblenz\.sozialpass\.app\/activation\/code#/)
          expect(download.suggestedFilename()).toBe('KoblenzPass.pdf')
          await verifyKoblenzPdf(download, applicants.standard, href!, 'koblenz-pass.png')
        },
      )
    },
  )

  test('should show error when entitlement is revoked', async ({ selfServicePage }) => {
    await selfServicePage.fillCard(applicants.revokedEntitlement)
    await selfServicePage.submit()
    await expect(selfServicePage.revokedToast).toBeVisible()
  })

  test('should show error when file reference is unknown', async ({ selfServicePage }) => {
    await selfServicePage.fillCard(applicants.unknownFileReference)
    await selfServicePage.submit()
    await expect(selfServicePage.unknownToast).toBeVisible()
  })
})
