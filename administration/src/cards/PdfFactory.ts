import { jsPDF } from 'jspdf'
import logo from './bavariaLogo' // FIXME
import { drawjsPDF } from '../util/qrcode'
import uint8ArrayToBase64 from '../util/uint8ArrayToBase64'
import { format } from 'date-fns'
import { Exception } from '../exception'
import { Region } from '../generated/graphql'
import { DynamicActivationCode, QrCode, StaticVerifyCode } from '../generated/card_pb'
import { daysSinceEpochToDate } from './validityPeriod'

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

function addLetter(
  doc: jsPDF,
  region: Region,
  activationCode: DynamicActivationCode,
  staticVerifyCode: StaticVerifyCode | null
) {
  const info = activationCode.info!

  const pageSize = doc.internal.pageSize
  const { width, height } = { width: pageSize.getWidth(), height: pageSize.getHeight() }
  const pageMargin = 20
  const pageBottom = height - pageMargin

  const logoSize = 25
  doc.addImage(logo, 'PNG', width / 2 - logoSize / 2, pageMargin, logoSize, logoSize)

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
      '1. Laden Sie sich die App "Ehrenamtskarte" herunter.',
      '2. Starten Sie die App und folgen Sie den Hinweisen zum Scannen des Anmeldecodes.',
      '3. Scannen Sie den Anmeldecode.',
    ],
    pageMargin,
    instructionsY,
    { baseline: 'middle' }
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

  if (staticVerifyCode) {
    doc.addPage()
    const qrCodeText2 = uint8ArrayToBase64(
      new QrCode({
        qrCode: {
          value: staticVerifyCode,
          case: 'staticVerifyCode',
        },
      }).toBinary()
    )
    drawjsPDF(qrCodeText2, qrCodeX, qrCodeY, qrCodeSize, doc)
  }
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
  region: Region,
  activationCodes: DynamicActivationCode[],
  staticCodes: StaticVerifyCode[] | null
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

    addLetter(doc, region, activationCodes[k], staticCodes![k])
    if (k !== activationCodes.length - 1) doc.addPage()
  }

  doc.setDocumentProperties({
    title: 'Anmeldecode',
    subject: 'Anmeldecode',
    author: 'Bayern',
    creator: 'Bayern',
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
