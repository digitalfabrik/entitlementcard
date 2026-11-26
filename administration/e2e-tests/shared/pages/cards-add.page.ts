import { type Download, type Locator, type Page } from '@playwright/test'

import { NuernbergApplicant } from '../data/nuernberg-applicants'
import { nuernberg } from '../tenants'
import { step } from '../user-manual'
import { fillDatePicker } from './date-picker'

/** Query parameters of a link which opens the card creation with prefilled card data */
export const prefilledCardParams = (applicant: NuernbergApplicant): URLSearchParams => {
  const params = new URLSearchParams({
    Name: applicant.name,
    Ablaufdatum: applicant.expiryDate,
    Startdatum: applicant.startDate,
    Geburtsdatum: applicant.birthDate,
    'Pass-ID': applicant.passId,
  })
  if (applicant.street1 !== undefined) params.set('Adresszeile 1', applicant.street1)
  if (applicant.street2 !== undefined) params.set('Adresszeile 2', applicant.street2)
  if (applicant.postalCode !== undefined) params.set('PLZ', applicant.postalCode)
  if (applicant.city !== undefined) params.set('Ort', applicant.city)
  return params
}

export const prefilledCardUrl = (applicant: NuernbergApplicant): string =>
  `${nuernberg.urls.cardsAdd}?${prefilledCardParams(applicant)}`

export class CardsAddPage {
  readonly nameInput: Locator
  readonly birthDateInput: Locator
  readonly startDateInput: Locator
  readonly expiryDateInput: Locator
  readonly passIdInput: Locator
  private readonly addCardButton: Locator
  private readonly printQrCodesButton: Locator
  private readonly csvExportButton: Locator

  constructor(public readonly page: Page) {
    this.nameInput = page.locator('#name-input')
    this.birthDateInput = this.dateInput(nuernberg.labels.birthDate)
    this.startDateInput = this.dateInput(nuernberg.labels.startDate)
    this.expiryDateInput = this.dateInput(nuernberg.labels.expiryDate)
    this.passIdInput = page.locator('#nuernberg-pass-id-input')
    this.addCardButton = page.getByRole('button', { name: nuernberg.labels.addCard })
    this.printQrCodesButton = page.getByRole('button', { name: nuernberg.labels.printCards })
    this.csvExportButton = page.getByRole('button', { name: nuernberg.labels.csvExport })
  }

  async goto(): Promise<void> {
    await step('Öffnen Sie **Karten erstellen**.', async () => {
      await this.page.goto(nuernberg.urls.cardsAdd)
    })
  }

  async gotoPrefilledCard(applicant: NuernbergApplicant): Promise<void> {
    await step('Öffnen Sie den Link mit den vorausgefüllten Kartendaten.', async () => {
      await this.page.goto(prefilledCardUrl(applicant))
    })
  }

  async fillCard(applicant: NuernbergApplicant, index = 0): Promise<void> {
    await step(
      'Füllen Sie **Name**, **Ablaufdatum**, **Startdatum**, **Geburtsdatum** und **Nürnberg-Pass-ID** aus.',
      async () => {
        await this.nameInput.nth(index).fill(applicant.name)
        await this.fillDate(nuernberg.labels.birthDate, applicant.birthDate, index)
        await this.fillDate(nuernberg.labels.startDate, applicant.startDate, index)
        await this.fillDate(nuernberg.labels.expiryDate, applicant.expiryDate, index)
        await this.passIdInput.nth(index).fill(applicant.passId)
      },
    )
  }

  // The selected date of a date picker is stored in a hidden input
  private dateGroup(label: string): Locator {
    return this.page.getByRole('group', { name: label, exact: true })
  }

  private dateInput(label: string): Locator {
    return this.dateGroup(label).locator('input')
  }

  private async fillDate(label: string, date: string, index: number): Promise<void> {
    await fillDatePicker(this.dateGroup(label).nth(index), date)
  }

  async addCard(applicant: NuernbergApplicant): Promise<void> {
    const cards = this.page.locator('.MuiCard-root')
    const countBefore = await cards.count()
    await step(
      'Klicken Sie auf **Karte hinzufügen** und füllen Sie die Felder der neuen Karte aus.',
      async () => {
        await this.addCardButton.click()
        await cards.nth(countBefore).waitFor({ state: 'visible' })
        await this.fillCard(applicant, countBefore)
      },
    )
  }

  async downloadPdf(): Promise<Download> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      step('Klicken Sie auf **QR-Codes drucken**.', () => this.printQrCodesButton.click()),
    ])
    return download
  }

  async downloadCsv(): Promise<Download> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      step('Klicken Sie auf **CSV Export**.', () => this.csvExportButton.click()),
    ])
    return download
  }
}
