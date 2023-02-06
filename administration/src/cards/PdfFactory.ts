import { drawQRCode } from '../util/qrcode'
import { uint8ArrayToBase64 } from '../util/base64'
import { Region } from '../generated/graphql'
import { CardInfo, DynamicActivationCode, QrCode, StaticVerificationCode } from '../generated/card_pb'
import { PdfConfig } from '../project-configs/getProjectConfig'
import { PDFDocument, PDFFont, PDFPage, StandardFonts } from 'pdf-lib'

const dynamicQRCodeSize = 84 // mm
const dynamicQRCodeX = 108 // mm
const dynamicQRCodeY = 73 // mm

const dynamicDetailWidth = 84 // mm
const dynamicDetailX = 108 // mm
const dynamicDetailY = 170 // mm
const dynamicDetailFontSize = 10

const staticBackQRCodeSize = 48 // mm
const staticBackQRCodeX = 51 // mm
const staticBackQRCodeY = 228 // mm

const staticFrontQRCodeSize = 23 // mm
const staticFrontQRCodeX = 156 // mm
const staticFrontQRCodeY = 249 // mm

const staticDetailWidth = 46 // mm
const staticDetailX = 107 // mm
const staticDetailY = 248 // mm
const staticDetailFontSize = 8

function mmToPt(mm: number) {
  return (mm / 25.4) * 72
}

type DynamicPdfQrCode = {
  value: DynamicActivationCode
  case: 'dynamicActivationCode'
}

type StaticPdfQrCode = {
  value: StaticVerificationCode
  case: 'staticVerificationCode'
}

type PdfQrCode = DynamicPdfQrCode | StaticPdfQrCode

async function fillContentAreas(
  doc: PDFDocument,
  templatePage: PDFPage,
  dynamicCode: DynamicPdfQrCode,
  staticCode: StaticPdfQrCode | null,
  region: Region,
  pdfConfig: PdfConfig
) {
  const helveticaFont = await doc.embedFont(StandardFonts.Helvetica)

  // Dynamic QR code
  fillCodeArea(dynamicCode, dynamicQRCodeX, dynamicQRCodeY, dynamicQRCodeSize, templatePage)
  fillDetailsArea(
    dynamicCode.value.info!,
    region,
    dynamicDetailX,
    dynamicDetailY,
    dynamicDetailWidth,
    helveticaFont,
    dynamicDetailFontSize,
    templatePage,
    false,
    pdfConfig
  )

  // Static QR code
  if (staticCode) {
    // Back
    fillCodeArea(staticCode, staticBackQRCodeX, staticBackQRCodeY, staticBackQRCodeSize, templatePage)

    // Front
    fillCodeArea(staticCode, staticFrontQRCodeX, staticFrontQRCodeY, staticFrontQRCodeSize, templatePage)
    fillDetailsArea(
      staticCode.value.info!,
      region,
      staticDetailX,
      staticDetailY,
      staticDetailWidth,
      helveticaFont,
      staticDetailFontSize,
      templatePage,
      true,
      pdfConfig
    )
  }
}

function fillDetailsArea(
  info: CardInfo,
  region: Region,
  x: number,
  y: number,
  width: number,
  font: PDFFont,
  fontSize: number,
  page: PDFPage,
  shorten: boolean,
  pdfConfig: PdfConfig
) {
  const detailXPdf = mmToPt(x)
  const detailYPdf = page.getSize().height - mmToPt(y)

  const lineHeight = mmToPt(5)

  const text = pdfConfig.infoToDetails(info, region, shorten)
  page.drawText(text, {
    font,
    x: detailXPdf,
    y: detailYPdf - lineHeight,
    maxWidth: mmToPt(width),
    wordBreaks: text.split('').filter(c => !'\n\f\r\u000B'.includes(c)), // Split on every character
    lineHeight,
    size: fontSize,
  })
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
  dynamicCodes: DynamicActivationCode[],
  staticCodes: StaticVerificationCode[] | null,
  region: Region,
  pdfConfig: PdfConfig
) {
  const doc = await PDFDocument.create()

  const templateDocument =
    pdfConfig.templatePath != null
      ? await PDFDocument.load(await fetch(pdfConfig.templatePath).then(res => res.arrayBuffer()))
      : null

  if (staticCodes !== null && dynamicCodes.length !== staticCodes.length) {
    throw new Error('Activation codes count does not match static codes count.')
  }

  for (let k = 0; k < dynamicCodes.length; k++) {
    const dynamicCode = dynamicCodes[k]
    const staticCode = staticCodes?.at(k)

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
      pdfConfig
    )
  }

  doc.setTitle(pdfConfig.title)
  doc.setAuthor(pdfConfig.issuer)

  const pdfBytes = await doc.save()
  return new Blob([pdfBytes], { type: 'application/pdf' })
}
