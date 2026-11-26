import { Download, expect } from '@playwright/test'
import { PDFParse } from 'pdf-parse'

import { NuernbergApplicant } from '../data/nuernberg-applicants'
import { maskRegions } from './image'

export function normalizeNameForFilename(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export const CSV_HEADERS = [
  'Name',
  'AddressLine1',
  'AddressLine2',
  'AddressLocation',
  'PassId',
  'Birthday',
  'StartDate',
  'ExpirationDate',
  'CardHash',
  'ActivationCode',
  'StaticUserCode',
]

const PDF_MASK_REGIONS = [
  { left: 340, top: 300, width: 195, height: 215 }, // activation QR code and card hash
  { left: 150, top: 630, width: 130, height: 130 }, // left static QR code
  { left: 465, top: 690, width: 60, height: 60 }, // right static QR code
]

export function parseCsv(content: string): Record<string, string>[] {
  const lines = content.trim().split(/\r?\n/)
  const headers = lines[0].split(',')
  return lines.slice(1).map(line => {
    const values = line.split(',')
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']))
  })
}

export function verifyCsvRow(row: Record<string, string>, applicant: NuernbergApplicant): void {
  // AddressLocation is a single space when no address is present
  const expectedLocation =
    applicant.postalCode && applicant.city ? `${applicant.postalCode} ${applicant.city}` : ' '
  expect(row).toMatchObject({
    Name: applicant.name,
    AddressLine1: applicant.street1 ?? '',
    AddressLine2: applicant.street2 ?? '',
    AddressLocation: expectedLocation,
    PassId: applicant.passId,
    Birthday: applicant.birthDate,
    StartDate: applicant.startDate,
    ExpirationDate: applicant.expiryDate,
  })
  expect(row.CardHash).not.toBe('')
  expect(row.ActivationCode).not.toBe('')
  expect(row.StaticUserCode).not.toBe('')
}

export async function verifyPassPdf(
  download: Download,
  pages: { applicant: NuernbergApplicant; snapshot: string }[],
): Promise<void> {
  const pdfPath = await download.path()
  expect(pdfPath).not.toBeNull()

  const parser = new PDFParse({ url: pdfPath! })
  try {
    const pdfText = await parser.getText()
    expect(pdfText.pages).toHaveLength(pages.length)

    const screenshot = await parser.getScreenshot({ imageDataUrl: false })
    for (let i = 0; i < pages.length; i++) {
      await verifyPdfPage(
        pdfText.pages[i].text,
        Buffer.from(screenshot.pages[i].data),
        pages[i].applicant,
        pages[i].snapshot,
      )
    }
  } finally {
    await parser.destroy()
  }
}

async function verifyPdfPage(
  pageText: string,
  screenshotData: Buffer,
  applicant: NuernbergApplicant,
  snapshot: string,
): Promise<void> {
  expect(pageText).toContain(applicant.name)
  expect(pageText).toContain('Pass-ID: ' + applicant.passId)
  expect(pageText).toContain('Geburtsdatum: ' + applicant.birthDate)
  expect(pageText).toContain(`Gültig: ${applicant.startDate} bis ${applicant.expiryDate}`)

  const masked = await maskRegions(screenshotData, PDF_MASK_REGIONS)
  expect(masked).toMatchSnapshot(snapshot)
}

export function verifyUniqueGeneratedFields(rows: Record<string, string>[]): void {
  for (const field of ['CardHash', 'ActivationCode', 'StaticUserCode']) {
    const values = rows.map(r => r[field])
    expect(new Set(values).size).toBe(rows.length)
  }
}
