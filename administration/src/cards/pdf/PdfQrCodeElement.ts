import { PDFPage } from 'pdf-lib'

import { QrCode } from '../../generated/card_pb'
import { uint8ArrayToBase64 } from '../../util/base64'
import { drawQRCode } from '../../util/qrcode'
import { Coordinates, PdfElement, mmToPt } from './PdfElements'

type PdfQrCode = Extract<QrCode['qrCode'], { case: 'staticVerificationCode' | 'dynamicActivationCode' }>

export type PdfQrCodeElementProps = {
  size: number
} & Coordinates

type PdfQrCodeElementRendererProps = {
  page: PDFPage
  qrCode: PdfQrCode
}

const pdfQrCodeElement: PdfElement<PdfQrCodeElementProps, PdfQrCodeElementRendererProps> = (
  { size, x, y },
  { page, qrCode }
) => {
  const qrCodeSizePdf = mmToPt(size)
  const qrCodeXPdf = mmToPt(x)
  const qrCodeYPdf = page.getSize().height - qrCodeSizePdf - mmToPt(y)

  const qrCodeContent = new QrCode({
    qrCode: qrCode,
  }).toBinary()

  // Log base64 activationCode for development purposes
  if (qrCode.case === 'dynamicActivationCode' && window.location.hostname === 'localhost') {
    console.log(uint8ArrayToBase64(qrCodeContent))
  }

  drawQRCode(qrCodeContent, qrCodeXPdf, qrCodeYPdf, qrCodeSizePdf, page, false)
}

export default pdfQrCodeElement
