import fontkit from '@pdf-lib/fontkit'
import { PDFDocument, PDFFont, PDFPage, StandardFonts } from 'pdf-lib'

import { Region } from '../generated/graphql'
import { PdfConfig, ProjectConfig } from '../project-configs/getProjectConfig'
import getDeepLinkFromQrCode from '../util/getDeepLinkFromQrCode'
import normalizeString from '../util/normalizeString'
import { reportErrorToSentry } from '../util/sentry'
import { Card } from './Card'
import { CreateCardsResult } from './createCards'
import pdfFormElement from './pdf/PdfFormElement'
import pdfLinkArea from './pdf/PdfLinkArea'
import pdfQrCodeElement, { PdfQrCode } from './pdf/PdfQrCodeElement'
import pdfTextElement from './pdf/PdfTextElement'

export class PdfError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PDFError'
  }
}

const loadCustomFontWithFallback = async (font: string, doc: PDFDocument, fallbackFont: string): Promise<PDFFont> => {
  doc.registerFontkit(fontkit)
  const fontUrl = `${process.env.PUBLIC_URL}/fonts/${font}`
  try {
    const res = await fetch(fontUrl)
    if (res.ok && res.headers.get('Content-Type')?.includes('font')) {
      const fontBytes = await res.arrayBuffer()
      return doc.embedFont(fontBytes)
    }
    reportErrorToSentry(`Couldn't load custom font ${font}. Using fallback font.`)
    return doc.embedFont(fallbackFont)
  } catch (error) {
    reportErrorToSentry(error)
    return doc.embedFont(fallbackFont)
  }
}

const fillContentAreas = async (
  doc: PDFDocument,
  templatePage: PDFPage,
  code: CreateCardsResult,
  card: Card,
  pdfConfig: PdfConfig,
  region?: Region
): Promise<void> => {
  const { dynamicActivationCode, staticVerificationCode, dynamicCardInfoHashBase64 } = code
  const dynamicCode: PdfQrCode = { case: 'dynamicActivationCode', value: dynamicActivationCode }
  const staticCode: PdfQrCode | null = staticVerificationCode
    ? {
        case: 'staticVerificationCode',
        value: staticVerificationCode,
      }
    : null
  const font = await doc.embedFont(StandardFonts.Helvetica)
  pdfConfig.elements?.dynamicActivationQrCodes.forEach(configOptions =>
    pdfQrCodeElement(configOptions, { page: templatePage, qrCode: dynamicCode })
  )

  const fontBold = pdfConfig.customBoldFont
    ? await loadCustomFontWithFallback(pdfConfig.customBoldFont, doc, StandardFonts.HelveticaBold)
    : await doc.embedFont(StandardFonts.HelveticaBold)

  if (pdfConfig.elements?.deepLinkArea) {
    pdfLinkArea(pdfConfig.elements.deepLinkArea, {
      doc,
      page: templatePage,
      font: fontBold,
      url: getDeepLinkFromQrCode(dynamicCode),
    })
  }

  if (staticCode) {
    pdfConfig.elements?.staticVerificationQrCodes?.forEach(configOptions =>
      pdfQrCodeElement(configOptions, { page: templatePage, qrCode: staticCode })
    )
  } else if (pdfConfig.elements?.staticVerificationQrCodes) {
    throw Error('To create this PDF a static QR-Code is required. However, it seems to be missing.')
  }

  const form = doc.getForm()
  pdfConfig.elements?.form?.forEach(configOptions =>
    pdfFormElement(configOptions, {
      page: templatePage,
      form,
      font,
      info: dynamicCode.value.info!,
      card,
      cardInfoHash: dynamicCardInfoHashBase64,
      region,
    })
  )

  pdfConfig.elements?.text.forEach(configOptions =>
    pdfTextElement(configOptions, {
      page: templatePage,
      font: configOptions.bold ? fontBold : font,
      info: dynamicCode.value.info!,
      card,
      cardInfoHash: dynamicCardInfoHashBase64,
      region,
    })
  )
}

export const generatePdf = async (
  codes: CreateCardsResult[],
  cards: Card[],
  projectConfig: ProjectConfig,
  region?: Region
): Promise<Blob> => {
  const pdfConfig = projectConfig.pdf
  try {
    const doc = await PDFDocument.create()
    const templateDocument = await PDFDocument.load(await fetch(pdfConfig.templatePath).then(res => res.arrayBuffer()))
    const [templatePage] = await doc.copyPages(templateDocument, [0])

    await Promise.all(
      codes.map(async (code, index) => {
        const page = doc.addPage(templatePage)
        await fillContentAreas(doc, page, code, cards[index], pdfConfig, region)
      })
    )

    doc.setTitle(pdfConfig.title)
    doc.setAuthor(pdfConfig.issuer)

    const pdfBytes = await doc.save()
    return new Blob([pdfBytes], { type: 'application/pdf' })
  } catch (error) {
    if (error instanceof Error) {
      throw new PdfError(error.message)
    }
    throw error
  }
}

export const getPdfFilename = (cards: Card[]): string => {
  // "Berechtigungskarte_" prefix needs to always be in the filename to ensure Nuernberg automation will not break
  const filename =
    cards.length === 1
      ? `Berechtigungskarte_${normalizeString(cards[0].fullName)}-${new Date().getFullYear()}`
      : 'berechtigungskarten'
  return `${filename}.pdf`
}
