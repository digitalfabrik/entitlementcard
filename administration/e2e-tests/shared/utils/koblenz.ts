import { type Download, expect } from '@playwright/test'
import { PDFParse } from 'pdf-parse'

import { KoblenzApplicant } from '../data/koblenz-applicants'
import { maskRegions } from './image'

const MASK_REGIONS = [
  { left: 370, top: 290, width: 150, height: 155 },
  { left: 430, top: 650, width: 100, height: 100 },
]

export async function verifyKoblenzPdf(
  download: Download,
  applicant: KoblenzApplicant,
  activationHref: string,
  snapshot: string,
): Promise<void> {
  const pdfPath = await download.path()
  expect(pdfPath).not.toBeNull()

  const parser = new PDFParse({ url: pdfPath! })
  try {
    const pdfText = await parser.getText()
    expect(pdfText.pages).toHaveLength(1)
    expect(pdfText.text).toContain(applicant.name)
    expect(pdfText.text).toContain(applicant.birthDate)

    const pdfInfo = await parser.getInfo({ parsePageInfo: true })
    const linkUrls = pdfInfo.pages.flatMap(p => p.links.map(l => l.url))
    const activationPath = activationHref.slice(activationHref.indexOf('/activation/code#'))
    expect(linkUrls).toEqual(expect.arrayContaining([expect.stringContaining(activationPath)]))

    const screenshot = await parser.getScreenshot({ imageDataUrl: false })
    const masked = await maskRegions(Buffer.from(screenshot.pages[0].data), MASK_REGIONS)
    expect(masked).toMatchSnapshot(snapshot)
  } finally {
    await parser.destroy()
  }
}
