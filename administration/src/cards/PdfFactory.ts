import { jsPDF } from 'jspdf'
import { drawjsPDF } from '../util/qrcode'
import uint8ArrayToBase64 from '../util/uint8ArrayToBase64'
import { format } from 'date-fns'
import { Exception } from '../exception'
import { Region } from '../generated/graphql'
import { DynamicActivationCode, QrCode } from '../generated/card_pb'
import { daysSinceEpochToDate } from './validityPeriod'
import { PdfConfig } from '../project-configs/getProjectConfig'

type TTFFont = {
  /**
   * Name of the font. This should not include whitespaces.
   */
  name: string
  /**
   * Style of the font stored in `data` field. If in doubt use "normal" here.
   */
  fontStyle: string
  /**
   * TTF file encoded as base64 string
   */
  data: string
}

export async function loadTTFFont(name: string, fontStyle: string, path: string): Promise<TTFFont> {
  return {
    name,
    fontStyle,
    data: uint8ArrayToBase64(new Uint8Array(await (await fetch(path)).arrayBuffer())),
  }
}

function drawDynamicActivationCode(
  doc: jsPDF,
  activationCode: DynamicActivationCode,
  region: Region,
  pdfConfig: PdfConfig
) {
  const info = activationCode.info!

  const pageSize = doc.internal.pageSize
  const { width, height } = { width: pageSize.getWidth(), height: pageSize.getHeight() }
  const pageMargin = 20
  const pageBottom = height - pageMargin

  if (pdfConfig.logo) {
    const logoSize = 25
    doc.addImage(pdfConfig.logo, 'PNG', width / 2 - logoSize / 2, pageMargin, logoSize, logoSize)
  }

  const greetingY = 60

  doc.setFontSize(16)

  doc.text(
    `Guten Tag, ${info.fullName}.
Ihre digitale Ehrenamtskarte ist da!`,
    pageMargin,
    greetingY
  )

  const qrCodeSize = 110
  const qrCodeY = pageBottom - qrCodeSize - 40
  const qrCodeX = (width - qrCodeSize) / 2
  const qrCodeMargin = 5

  doc.setFontSize(12)
  const instructionsY = (qrCodeY - qrCodeMargin - 16 + greetingY) / 2
  doc.text(
    [
      'Anleitung:',
      `1. Laden Sie sich die App "${pdfConfig.appName}" herunter.`,
      '2. Starten Sie die App und tippen Sie auf "Ausweisen". Folgen Sie den Hinweisen zum Aktivieren des Anmeldecodes.',
      '3. Scannen Sie den Anmeldecode.',
      '4. Halten Sie den Anmeldecode geheim und teilen Sie ihn mit niemandem.',
    ],
    pageMargin,
    instructionsY,
    { baseline: 'middle', maxWidth: 100 }
  )

  doc.setFontSize(16)
  doc.text('Anmeldecode', width / 2, qrCodeY - qrCodeMargin, undefined, 'center')
  const qrCodeText = uint8ArrayToBase64(
    new QrCode({
      qrCode: {
        value: activationCode,
        case: 'dynamicActivationCode',
      },
    }).toBinary()
  )
  drawjsPDF(qrCodeText, qrCodeX, qrCodeY, qrCodeSize, doc)
  doc.setFontSize(12)
  const DetailsY = qrCodeY + qrCodeSize + qrCodeMargin
  const expirationDateInt = Number(info.expirationDay)
  const expirationDate =
    expirationDateInt > 0 ? format(daysSinceEpochToDate(expirationDateInt), 'dd.MM.yyyy') : 'unbegrenzt'
  doc.text(
    `Name: ${info!.fullName}
Karte ausgestellt am: ${format(new Date(), 'dd.MM.yyyy')}
Karte gültig bis: ${expirationDate}
Aussteller: ${region.prefix} ${region.name}`,
    width / 2,
    DetailsY,
    { align: 'center', baseline: 'top' }
  )

  doc.setFontSize(12)
  doc.textWithLink(
    'Öffnen Sie den folgenden Link, um die App herunterzuladen:\nhttps://download.bayern.ehrenamtskarte.app',
    width / 2,
    pageBottom,
    {
      url: 'https://download.bayern.ehrenamtskarte.app',
      align: 'center',
    }
  )
}

function checkForeignText(doc: jsPDF, text: string): string | null {
  const font = doc.getFont()

  for (let i = 0; i < text.length; i++) {
    if (font.metadata.characterToGlyph(text.charCodeAt(i)) === 0) {
      return text.charAt(i)
    }
  }

  return null
}

export function generatePdf(
  font: TTFFont,
  activationCodes: DynamicActivationCode[],
  region: Region,
  pdfConfig: PdfConfig
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const fontFileName = `${font.name}.ttf`
  doc.addFileToVFS(fontFileName, font.data)
  doc.addFont(fontFileName, font.name, font.fontStyle)
  doc.setFont(font.name)

  for (let k = 0; k < activationCodes.length; k++) {
    const activationCode = activationCodes[k]
    const unsupportedChar = checkForeignText(doc, activationCode.info!.fullName)

    if (unsupportedChar) {
      throw new Exception({
        type: 'unicode',
        unsupportedChar,
      })
    }

    drawDynamicActivationCode(doc, activationCodes[k], region, pdfConfig)
    if (k !== activationCodes.length - 1) {
      doc.addPage()
    }
  }

  doc.setDocumentProperties({
    title: 'Anmeldecode',
    subject: 'Anmeldecode',
    author: pdfConfig.issuer,
    creator: 'Entitlementcard Project',
  })

  try {
    const output = doc.output('blob')
    return new Blob([output], { type: 'application/pdf' })
  } catch {
    throw new Exception({
      type: 'pdf-generation',
    })
  }
}
