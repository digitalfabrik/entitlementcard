import { type Download, type Locator, type Page } from '@playwright/test'

import { KoblenzApplicant } from '../data/koblenz-applicants'
import { koblenz } from '../tenants'
import { step } from '../user-manual'
import { fillDatePicker } from './date-picker'

export class SelfServicePage {
  readonly welcomeHeading: Locator
  readonly cardCreatedHeading: Locator
  readonly activationHeading: Locator
  readonly activationLink: Locator
  readonly revokedToast: Locator
  readonly unknownToast: Locator
  private readonly submitButton: Locator
  private readonly proceedButton: Locator
  private readonly downloadPdfButton: Locator

  constructor(public readonly page: Page) {
    this.welcomeHeading = page.getByRole('heading', { name: /Herzlich Willkommen/ })
    this.cardCreatedHeading = page.getByRole('heading', { name: /Ihr KoblenzPass wurde erstellt/ })
    this.activationHeading = page.getByRole('heading', { name: /Fast geschafft/ })
    this.activationLink = page.getByRole('link', { name: koblenz.labels.activationLink })
    this.revokedToast = page.getByText(koblenz.labels.revokedToast)
    this.unknownToast = page.getByText(koblenz.labels.unknownToast)
    this.submitButton = page.getByRole('button', { name: koblenz.labels.submit })
    this.proceedButton = page.getByRole('button', { name: koblenz.labels.proceed })
    this.downloadPdfButton = page.getByRole('button', { name: koblenz.labels.downloadPdf })
  }

  async goto(): Promise<void> {
    await step('Öffnen Sie im Browser die Seite zum Erstellen des KoblenzPasses.', async () => {
      await this.page.goto(koblenz.urls.selfServiceCreate)
    })
  }

  async fillCard(applicant: KoblenzApplicant): Promise<void> {
    await step(
      'Füllen Sie **Vorname Name**, **Geburtsdatum** und **Aktenzeichen** aus und bestätigen Sie die **Datenschutzerklärung**.',
      async () => {
        await this.page.getByLabel(koblenz.labels.firstName).fill(applicant.name)
        await fillDatePicker(
          this.page.getByRole('group', { name: koblenz.labels.birthDate, exact: true }),
          applicant.birthDate,
        )
        await this.page.getByLabel(koblenz.labels.fileReference).fill(applicant.fileReference)
        await this.page.getByLabel(koblenz.labels.privacyPolicy).check()
      },
    )
  }

  async submit(): Promise<void> {
    await step('Klicken Sie auf **KoblenzPass erstellen**.', () => this.submitButton.click())
  }

  async proceed(): Promise<void> {
    await step('Klicken Sie auf **Weiter zur Aktivierung**.', () => this.proceedButton.click())
  }

  async downloadPdf(): Promise<Download> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      step('Klicken Sie auf **KoblenzPass PDF**, um den Pass als PDF herunterzuladen.', () =>
        this.downloadPdfButton.click(),
      ),
    ])
    return download
  }
}
