import { jsPDF } from 'jspdf'
import { drawjsPDF } from '../util/qrcode'
import uint8ArrayToBase64 from '../util/uint8ArrayToBase64'
import { format } from 'date-fns'
import { Exception } from '../exception'
import { Region } from '../generated/graphql'
import { DynamicActivationCode, QrCode } from '../generated/card_pb'
import { daysSinceEpochToDate } from './validityPeriod'
import { PdfConfig } from '../project-configs/getProjectConfig'
import googlePlayLogo from './assets/google-play-store-badge.png'
import appleAppStoreLogo from './assets/apple-app-store-badge.png'

const originalBadgeWidth = 646
const originalBadgeHeight = 250

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

  // BEGIN CONFIG

  // Page
  const pageMargin = 10
  const pageBottom = height - pageMargin

  // Greeting
  const greetingY = 60

  // QRCode
  const qrCodeSize = 110
  const qrCodeY = pageBottom - qrCodeSize - 40
  const qrCodeX = (width - qrCodeSize) / 2
  const qrCodeMargin = 5

  // Text
  const fontSizeTiny = 6
  const fontSizeSmall = 12
  const fontSizeMedium = 24

  // Badge
  const badgeSizeFactor = 1 / 15
  const badgeMargin = 1
  const badgeWidth = originalBadgeWidth * badgeSizeFactor
  const badgeHeight = originalBadgeHeight * badgeSizeFactor

  // END CONFIG

  // Logo
  if (pdfConfig.logo) {
    const logoSize = 25
    doc.addImage(pdfConfig.logo, 'PNG', width / 2 - logoSize / 2, pageMargin, logoSize, logoSize)
  }

  // Greeting
  doc.setFontSize(fontSizeMedium)
  doc.text(pdfConfig.greeting(info.fullName), pageMargin, greetingY)

  // Instructions
  doc.setFontSize(fontSizeSmall)
  const instructionsY = (qrCodeY - qrCodeMargin - 16 + greetingY) / 2

  doc.html(
    '\t\t<ol style="font-size: 20pt">\n' +
      '\t\t\t<li>OL Item (default)</li>\n' +
      "\t\t\t<li style='list-style-type: decimal'>OL Item (decimal)</li>\n" +
      '\t\t</ol>',
    {
      callback: function (doc) {
        doc.save()
      },
      x: 10,
      y: 10,
    }
  )

  // @ts-ignore
  doc.rect = () => {}
  doc.table(
    pageMargin,
    instructionsY,
    [
      {
        id: '',
        line: 'Anleitung:',
      },
      {
        id: '1.',
        line: `Laden Sie sich die App "${pdfConfig.appName}" im Google Play oder Apple Store herunter.`,
      },
      {
        id: '2.',
        line: 'Starten Sie die App und tippen Sie auf "Ausweisen". Folgen Sie den Hinweisen zum Aktivieren des Anmeldecodes.',
      },
      {
        id: '3.',
        line: 'Scannen Sie den Anmeldecode.',
      },
      {
        id: '4.',
        line: 'Halten Sie den Anmeldecode geheim und teilen Sie ihn mit niemandem.',
      },
    ],
    [
      { width: 5, name: 'id', align: 'left', padding: 0, prompt: '' },
      { width: pageSize.width / 2 - pageMargin, name: 'line', align: 'left', padding: 0, prompt: '' },
    ],
    { printHeaders: false, margins: 0, autoSize: false, fontSize: fontSizeSmall }
  )

  // QRCode
  doc.setFontSize(fontSizeSmall)
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

  // Details
  const detailY = qrCodeY + qrCodeSize + qrCodeMargin
  const expirationDateInt = Number(info.expirationDay)
  const expirationDate =
    expirationDateInt > 0 ? format(daysSinceEpochToDate(expirationDateInt), 'dd.MM.yyyy') : 'unbegrenzt'
  doc.setFontSize(fontSizeSmall)
  doc.text(
    `Name: ${info!.fullName}
Karte ausgestellt am: ${format(new Date(), 'dd.MM.yyyy')}
Karte gültig bis: ${expirationDate}
Aussteller: ${region.prefix} ${region.name}`,
    width / 2,
    detailY,
    { align: 'center', baseline: 'top' }
  )

  // Badges
  doc.addImage(
    googlePlayLogo,
    'PNG',
    width - pageMargin - badgeWidth,
    pageBottom - badgeHeight,
    badgeWidth,
    badgeHeight
  )
  doc.addImage(
    appleAppStoreLogo,
    'PNG',
    width - pageMargin - 2 * badgeWidth - badgeMargin,
    pageBottom - badgeHeight,
    badgeWidth,
    badgeHeight
  )
  doc.setFontSize(fontSizeTiny)
  doc.textWithLink(
    pdfConfig.appDownloadLink.replace('https://', ''),
    width - pageMargin - badgeWidth,
    pageBottom + badgeMargin,
    {
      url: pdfConfig.appDownloadLink,
      align: 'center',
    }
  )

  // Google Play und das Google Play-Logo sind Marken von Google LLC.
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
