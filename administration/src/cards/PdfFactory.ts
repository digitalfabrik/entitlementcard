import { PDFDocument, PDFPage, StandardFonts } from 'pdf-lib'

import { QrCode } from '../generated/card_pb'
import { Region } from '../generated/graphql'
import { PdfConfig } from '../project-configs/getProjectConfig'
import generateDeepLink from '../util/generateDeepLink'
import CardBlueprint from './CardBlueprint'
import { CreateCardsResult } from './createCards'
import pdfFormElement from './pdf/PdfFormElement'
import pdfLinkElement from './pdf/PdfLinkElement'
import pdfQrCodeElement, { PdfQrCode } from './pdf/PdfQrCodeElement'
import pdfTextElement from './pdf/PdfTextElement'

export class PDFError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PDFError'
  }
}

async function fillContentAreas(
  doc: PDFDocument,
  templatePage: PDFPage,
  cardInfoHashBase64: string,
  dynamicCode: Extract<QrCode['qrCode'], { case: 'dynamicActivationCode' }>,
  staticCode: Extract<QrCode['qrCode'], { case: 'staticVerificationCode' }> | null,
  region: Region,
  cardBlueprint: CardBlueprint,
  pdfConfig: PdfConfig,
  deepLink: string
) {
  const helveticaFont = await doc.embedFont(StandardFonts.Helvetica)
  pdfConfig.elements?.dynamicActivationQrCodes.forEach(configOptions =>
    pdfQrCodeElement(configOptions, { page: templatePage, qrCode: dynamicCode })
  )

  if (pdfConfig.elements?.deepLink) {
    const helveticaBoldFont = await doc.embedFont(StandardFonts.HelveticaBold)
    pdfLinkElement(pdfConfig.elements.deepLink, {
      doc,
      page: templatePage,
      font: helveticaBoldFont,
      url: deepLink,
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
      font: helveticaFont,
      info: dynamicCode.value.info!,
      region: region,
      cardBlueprint,
      cardInfoHash: cardInfoHashBase64,
    })
  )

  pdfConfig.elements?.text.forEach(configOptions =>
    pdfTextElement(configOptions, {
      page: templatePage,
      font: helveticaFont,
      info: dynamicCode.value.info!,
      region: region,
      cardBlueprint,
      cardInfoHash: cardInfoHashBase64,
    })
  )
}

export async function generatePdf(
  codes: CreateCardsResult[],
  cardBlueprints: CardBlueprint[],
  region: Region,
  pdfConfig: PdfConfig
) {
  try {
    const doc = await PDFDocument.create()

    const templateDocument =
      pdfConfig.templatePath != null
        ? await PDFDocument.load(await fetch(pdfConfig.templatePath).then(res => res.arrayBuffer()))
        : null

    for (let k = 0; k < codes.length; k++) {
      const dynamicCode = codes[k].dynamicActivationCode
      const staticCode = codes[k].staticVerificationCode
      const cardInfoHashBase64 = codes[k].dynamicCardInfoHashBase64
      const cardBlueprint = cardBlueprints[k]

      const [templatePage] = templateDocument ? await doc.copyPages(templateDocument, [0]) : [null]

      const page = doc.addPage(templatePage ? templatePage : undefined)
      const dynamicPdfQrCode: PdfQrCode = {
        case: 'dynamicActivationCode',
        value: dynamicCode,
      }

      await fillContentAreas(
        doc,
        page,
        cardInfoHashBase64,
        dynamicPdfQrCode,
        staticCode
          ? {
              case: 'staticVerificationCode',
              value: staticCode,
            }
          : null,
        region,
        cardBlueprint,
        pdfConfig,
        generateDeepLink(dynamicPdfQrCode)
      )
    }

    doc.setTitle(pdfConfig.title)
    doc.setAuthor(pdfConfig.issuer)

    const pdfBytes = await doc.save()
    return new Blob([pdfBytes], { type: 'application/pdf' })
  } catch (error) {
    if (error instanceof Error) throw new PDFError(error.message)
    throw error
  }
}
