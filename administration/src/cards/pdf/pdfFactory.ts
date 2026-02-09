import { PDFDocument, PDFFont, PDFPage, StandardFonts } from '@cantoo/pdf-lib'
import fontkit from '@pdf-lib/fontkit'

import { Region } from '../../generated/graphql'
import { PdfConfig, ProjectConfig } from '../../project-configs'
import { getBuildConfig } from '../../util/getBuildConfig'
import { isProductionEnvironment } from '../../util/helper'
import normalizeString from '../../util/normalizeString'
import { reportErrorToSentry } from '../../util/sentry'
import { Card } from '../card'
import { CreateCardsResult } from '../createCards'
import getDeepLinkFromQrCode from '../getDeepLinkFromQrCode'
import {
  type PdfQrCode,
  pdfFormElement,
  pdfLinkArea,
  pdfQrCodeElement,
  pdfTextElement,
} from './elements'

export class PdfError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PDFError'
  }
}

const loadCustomFontWithFallback = async (
  font: string,
  doc: PDFDocument,
  fallbackFont: string,
): Promise<PDFFont> => {
  doc.registerFontkit(fontkit)
  const fontUrl = `/fonts/${font}`

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
  page: PDFPage,
  code: CreateCardsResult,
  card: Card,
  pdfConfig: PdfConfig,
  region: Region | undefined,
): Promise<void> => {
  const font = pdfConfig.customFont
    ? await loadCustomFontWithFallback(pdfConfig.customFont, doc, StandardFonts.Helvetica)
    : await doc.embedFont(StandardFonts.Helvetica)

  const fontBold = pdfConfig.customBoldFont
    ? await loadCustomFontWithFallback(pdfConfig.customBoldFont, doc, StandardFonts.HelveticaBold)
    : await doc.embedFont(StandardFonts.HelveticaBold)
  const dynamicCode: PdfQrCode = {
    case: 'dynamicActivationCode',
    value: code.dynamicActivationCode,
  }

  pdfConfig.elements?.dynamicActivationQrCodes.forEach(configOptions =>
    pdfQrCodeElement(configOptions, { page, qrCode: dynamicCode }),
  )

  if (pdfConfig.elements?.deepLinkArea) {
    pdfLinkArea(pdfConfig.elements.deepLinkArea, {
      doc,
      page,
      font: fontBold,
      url: getDeepLinkFromQrCode(
        dynamicCode,
        getBuildConfig(window.location.hostname),
        isProductionEnvironment(),
      ),
    })
  }

  if (pdfConfig.elements?.staticVerificationQrCodes) {
    if (code.staticVerificationCode) {
      const staticCode: PdfQrCode = {
        case: 'staticVerificationCode',
        value: code.staticVerificationCode,
      }

      pdfConfig.elements.staticVerificationQrCodes.forEach(configOptions =>
        pdfQrCodeElement(configOptions, { page, qrCode: staticCode }),
      )
    } else {
      throw Error(
        'To create this PDF a static QR-Code is required. However, it seems to be missing.',
      )
    }
  }

  const form = doc.getForm()

  pdfConfig.elements?.form?.forEach(configOptions =>
    pdfFormElement(configOptions, {
      page,
      form,
      font,
      info: dynamicCode.value.info!,
      card,
      cardInfoHash: code.dynamicCardInfoHashBase64,
      region,
    }),
  )
  pdfConfig.elements?.text.forEach(configOptions =>
    pdfTextElement(configOptions, {
      page,
      font: configOptions.bold ? fontBold : font,
      info: dynamicCode.value.info!,
      card,
      cardInfoHash: code.dynamicCardInfoHashBase64,
      region,
    }),
  )
}

export const generatePdf = async (
  codes: CreateCardsResult[],
  cards: Card[],
  projectConfig: ProjectConfig,
  region?: Region,
): Promise<Blob> => {
  try {
    const templateDocument = await PDFDocument.load(
      await (await fetch(projectConfig.pdf.templatePath)).arrayBuffer(),
    )

    const doc = await PDFDocument.create()

    for (let index = 0; index < codes.length; index++) {
      const [templatePage] = await doc.copyPages(templateDocument, [0])
      const page = doc.addPage(templatePage)
      await fillContentAreas(
        templateDocument,
        doc,
        page,
        codes[index],
        cards[index],
        projectConfig.pdf,
        region,
      )
    }

    return new Blob([(await doc.save()).buffer as ArrayBuffer], { type: 'application/pdf' })
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
