import { applicants } from '../shared/data/koblenz-applicants'
import { expect, test } from '../shared/fixtures/koblenz'
import { verifyKoblenzPdf } from '../shared/utils'

test.describe('Self-service', () => {
  test.beforeEach(async ({ selfServicePage }) => {
    await selfServicePage.goto()
  })

  test('should create, activate and download card', async ({ selfServicePage }) => {
    await expect(selfServicePage.welcomeHeading).toBeVisible()

    await selfServicePage.fillCard(applicants.standard)
    await selfServicePage.submit()

    await expect(selfServicePage.cardCreatedHeading).toBeVisible()
    await selfServicePage.proceed()

    await expect(selfServicePage.activationHeading).toBeVisible()
    const href = await selfServicePage.activationLink.getAttribute('href')
    expect(href).toMatch(/^koblenzpass:\/\/koblenz\.sozialpass\.app\/activation\/code#/)

    const download = await selfServicePage.downloadPdf()
    expect(download.suggestedFilename()).toBe('KoblenzPass.pdf')
    await verifyKoblenzPdf(download, applicants.standard, href!, 'koblenz-pass.png')
  })

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
