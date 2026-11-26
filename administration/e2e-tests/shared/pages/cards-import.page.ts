import { type Download, type Locator, type Page } from '@playwright/test'

import { NuernbergApplicant } from '../data/nuernberg-applicants'
import { nuernberg } from '../tenants'
import { step } from '../user-manual'

export class CardsImportPage {
  readonly chooseFileButton: Locator
  private readonly printQrCodesButton: Locator
  private readonly csvExportButton: Locator

  constructor(public readonly page: Page) {
    this.chooseFileButton = page.getByRole('button', { name: nuernberg.labels.chooseFile })
    this.printQrCodesButton = page.getByRole('button', { name: nuernberg.labels.printCards })
    this.csvExportButton = page.getByRole('button', { name: nuernberg.labels.csvExport })
  }

  async goto(): Promise<void> {
    await step('Öffnen Sie **Mehrere Karten importieren**.', async () => {
      await this.page.goto(nuernberg.urls.cardsImport)
    })
  }

  async uploadCsv(applicants: NuernbergApplicant[]): Promise<void> {
    const headers = [
      'Name',
      'Ablaufdatum',
      'Startdatum',
      'Geburtsdatum',
      'Pass-ID',
      'Adresszeile 1',
      'Adresszeile 2',
      'PLZ',
      'Ort',
    ]
    const dataRows = applicants.map(a =>
      [
        a.name,
        a.expiryDate,
        a.startDate,
        a.birthDate,
        a.passId,
        a.street1 ?? '',
        a.street2 ?? '',
        a.postalCode ?? '',
        a.city ?? '',
      ].join(','),
    )
    const csv = [headers.join(','), ...dataRows].join('\n')

    await step(
      'Klicken Sie auf **Datei wählen** und wählen Sie die CSV-Datei mit den Kartendaten aus.',
      async () => {
        const [chooser] = await Promise.all([
          this.page.waitForEvent('filechooser'),
          this.chooseFileButton.click(),
        ])
        await chooser.setFiles({
          name: 'nuernberg-import.csv',
          mimeType: 'text/csv',
          buffer: Buffer.from(csv),
        })
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
