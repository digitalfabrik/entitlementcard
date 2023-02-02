import { drawQRCode } from '../util/qrcode'
import uint8ArrayToBase64 from '../util/uint8ArrayToBase64'
import { format } from 'date-fns'
import { Region } from '../generated/graphql'
import { CardInfo, DynamicActivationCode, QrCode, StaticVerificationCode } from '../generated/card_pb'
import { daysSinceEpochToDate } from './validityPeriod'
import { PdfConfig } from '../project-configs/getProjectConfig'
import { PDFDocument, PDFFont, PDFPage, StandardFonts } from 'pdf-lib'

const dynamicQRCodeSize = 90 // mm
const dynamicQRCodeX = 105 // mm
const dynamicQRCodeY = 70 // mm

const dynamicDetailX = 105 // mm
const dynamicDetailY = 170 // mm
const dynamicDetailWidth = 90 // mm

const staticQRCodeSize = 50 // mm
const staticQRCodeX = 110 // mm
const staticQRCodeY = 227 // mm

const staticDetailX = 50 // mm
const staticDetailY = 227 // mm
const staticDetailWidth = 50 // mm

function mmToPt(mm: number) {
  return (mm / 25.4) * 72
}

type TopPdfQrCode = {
  value: DynamicActivationCode
  case: 'dynamicActivationCode'
}

type BottomPdfQrCode = {
  value: StaticVerificationCode
  case: 'staticVerificationCode'
}

type PdfQrCode = TopPdfQrCode | BottomPdfQrCode

async function fillContentAreas(
  doc: PDFDocument,
  templatePage: PDFPage,
  topQrCode: TopPdfQrCode,
  bottomQrCode: BottomPdfQrCode | null,
  region: Region
) {
  const info = topQrCode.value.info!

  const helveticaFont = await doc.embedFont(StandardFonts.Helvetica)

  // Top QR code
  fillCodeArea(topQrCode, dynamicQRCodeX, dynamicQRCodeY, dynamicQRCodeSize, templatePage)
  fillDetailsArea(info!, region, dynamicDetailX, dynamicDetailY, dynamicDetailWidth, helveticaFont, templatePage)

  // Bottom QR code
  if (bottomQrCode) {
    fillCodeArea(bottomQrCode, staticQRCodeX, staticQRCodeY, staticQRCodeSize, templatePage)
    fillDetailsArea(info!, region, staticDetailX, staticDetailY, staticDetailWidth, helveticaFont, templatePage)
  }
}

function fillDetailsArea(
  info: CardInfo,
  region: Region,
  x: number,
  y: number,
  width: number,
  font: PDFFont,
  page: PDFPage
) {
  const detailXPdf = mmToPt(x)
  const detailYPdf = page.getSize().height - mmToPt(y)

  const lineHeight = mmToPt(5)

  const expirationDateInt = Number(info.expirationDay)
  const expirationDate =
    expirationDateInt > 0 ? format(daysSinceEpochToDate(expirationDateInt), 'dd.MM.yyyy') : 'unbegrenzt'
  page.drawText(
    `Name: ${info!.fullName}
Ausgestellt am: ${format(new Date(), 'dd.MM.yyyy')}
Gültig bis: ${expirationDate}
Aussteller: ${region.prefix} ${region.name}`,
    {
      font,
      x: detailXPdf,
      y: detailYPdf - lineHeight,
      maxWidth: mmToPt(width),
      lineHeight,
      size: 10,
    }
  )
}

function fillCodeArea(qrCode: PdfQrCode, x: number, y: number, size: number, page: PDFPage) {
  const qrCodeSizePdf = mmToPt(size)
  const qrCodeXPdf = mmToPt(x)
  const qrCodeYPdf = page.getSize().height - qrCodeSizePdf - mmToPt(y)

  const qrCodeContent = uint8ArrayToBase64(
    new QrCode({
      qrCode: qrCode,
    }).toBinary()
  )
  drawQRCode(qrCodeContent, qrCodeXPdf, qrCodeYPdf, qrCodeSizePdf, page, false)
}

export async function generatePdf(
  activationCodes: DynamicActivationCode[],
  staticCodes: StaticVerificationCode[] | null,
  region: Region,
  pdfConfig: PdfConfig
) {
  const doc = await PDFDocument.create()

  const templateDocument =
    pdfConfig.templatePath != null
      ? await PDFDocument.load(await fetch(pdfConfig.templatePath).then(res => res.arrayBuffer()))
      : null

  for (let k = 0; k < activationCodes.length; k++) {
    const topCode = activationCodes[k]
    const bottomCode = staticCodes?.at(k)

    const [templatePage] = templateDocument ? await doc.copyPages(templateDocument, [0]) : [null]

    const page = doc.addPage(templatePage ? templatePage : undefined)

    await fillContentAreas(
      doc,
      page,
      {
        case: 'dynamicActivationCode',
        value: topCode,
      },
      bottomCode
        ? {
            case: 'staticVerificationCode',
            value: bottomCode,
          }
        : null,
      region
    )
  }

  doc.setTitle('Karten')
  doc.setAuthor(pdfConfig.issuer)

  const pdfBytes = await doc.save()
  return new Blob([pdfBytes], { type: 'application/pdf' })
}
