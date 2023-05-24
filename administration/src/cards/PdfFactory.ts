import { PDFDocument, PDFPage, StandardFonts } from 'pdf-lib'

import { DynamicActivationCode, QrCode, StaticVerificationCode } from '../generated/card_pb'
import { Region } from '../generated/graphql'
import { PdfConfig } from '../project-configs/getProjectConfig'
import CardBlueprint from './CardBlueprint'
import pdfQrCodeElement from './pdf/PdfQrCodeElement'
import pdfTextElement from './pdf/pdfTextElement'

export class PDFError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PDFError'
  }
}

async function fillContentAreas(
  doc: PDFDocument,
  templatePage: PDFPage,
  dynamicCode: Extract<QrCode['qrCode'], { case: 'dynamicActivationCode' }>,
  staticCode: Extract<QrCode['qrCode'], { case: 'staticVerificationCode' }> | null,
  region: Region,
  cardBlueprint: CardBlueprint,
  pdfConfig: PdfConfig
) {
  const helveticaFont = await doc.embedFont(StandardFonts.Helvetica)

  pdfConfig.elements?.dynamicActivationQrCodes.forEach(configOptions =>
    pdfQrCodeElement(configOptions, { page: templatePage, qrCode: dynamicCode })
  )

  if (staticCode) {
    pdfConfig.elements?.staticVerificationQrCodes?.forEach(configOptions =>
      pdfQrCodeElement(configOptions, { page: templatePage, qrCode: staticCode })
    )
  }

  pdfConfig.elements?.text.forEach(configOptions =>
    pdfTextElement(configOptions, {
      page: templatePage,
      font: helveticaFont,
      info: dynamicCode.value.info!,
      region: region,
      cardBlueprint,
    })
  )
}

export async function generatePdf(
  dynamicCodes: DynamicActivationCode[],
  staticCodes: StaticVerificationCode[],
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

    if (staticCodes.length !== 0 && dynamicCodes.length !== staticCodes.length) {
      throw new PDFError('Activation codes count does not match static codes count.')
    }

    for (let k = 0; k < dynamicCodes.length; k++) {
      const dynamicCode = dynamicCodes[k]
      const staticCode = staticCodes?.at(k)
      const cardBlueprint = cardBlueprints[k]

      const [templatePage] = templateDocument ? await doc.copyPages(templateDocument, [0]) : [null]

      const page = doc.addPage(templatePage ? templatePage : undefined)

      await fillContentAreas(
        doc,
        page,
        {
          case: 'dynamicActivationCode',
          value: dynamicCode,
        },
        staticCode
          ? {
              case: 'staticVerificationCode',
              value: staticCode,
            }
          : null,
        region,
        cardBlueprint,
        pdfConfig
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
