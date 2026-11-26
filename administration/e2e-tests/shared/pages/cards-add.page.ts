import { type Download, type Locator, type Page } from '@playwright/test'

import { NuernbergApplicant } from '../data/nuernberg-applicants'
import { nuernberg } from '../tenants'

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
    this.birthDateInput = page
      .getByRole('group', { name: nuernberg.labels.birthDate })
      .getByLabel(nuernberg.labels.birthDate)
    this.startDateInput = page
      .getByRole('group', { name: nuernberg.labels.startDate })
      .getByLabel(nuernberg.labels.startDate)
    this.expiryDateInput = page
      .getByRole('group', { name: nuernberg.labels.expiryDate })
      .getByLabel(nuernberg.labels.expiryDate)
    this.passIdInput = page.locator('#nuernberg-pass-id-input')
    this.addCardButton = page.getByRole('button', { name: nuernberg.labels.addCard })
    this.printQrCodesButton = page.getByRole('button', { name: nuernberg.labels.printCards })
    this.csvExportButton = page.getByRole('button', { name: nuernberg.labels.csvExport })
  }

  async goto(): Promise<void> {
    await this.page.goto(nuernberg.urls.cardsAdd)
  }

  async gotoPrefilledCard(applicant: NuernbergApplicant): Promise<void> {
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
    await this.page.goto(`${nuernberg.urls.cardsAdd}?${params}`)
  }

  async fillCard(applicant: NuernbergApplicant, index = 0): Promise<void> {
    await this.nameInput.nth(index).fill(applicant.name)
    await this.page
      .getByRole('group', { name: nuernberg.labels.birthDate })
      .getByLabel(nuernberg.labels.birthDate)
      .nth(index)
      .fill(applicant.birthDate)
    await this.page
      .getByRole('group', { name: nuernberg.labels.startDate })
      .getByLabel(nuernberg.labels.startDate)
      .nth(index)
      .fill(applicant.startDate)
    await this.page
      .getByRole('group', { name: nuernberg.labels.expiryDate })
      .getByLabel(nuernberg.labels.expiryDate)
      .nth(index)
      .fill(applicant.expiryDate)
    await this.passIdInput.nth(index).fill(applicant.passId)
  }

  async addCard(applicant: NuernbergApplicant): Promise<void> {
    const cards = this.page.locator('.MuiCard-root')
    const countBefore = await cards.count()
    await this.addCardButton.click()
    await cards.nth(countBefore).waitFor({ state: 'visible' })
    await this.fillCard(applicant, countBefore)
  }

  async downloadPdf(): Promise<Download> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.printQrCodesButton.click(),
    ])
    return download
  }

  async downloadCsv(): Promise<Download> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.csvExportButton.click(),
    ])
    return download
  }
}
