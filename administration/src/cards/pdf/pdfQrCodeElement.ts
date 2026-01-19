import { PDFPage } from '@cantoo/pdf-lib'

import { QrCode } from '../../generated/card_pb'
import { drawQRCode } from '../../util/qrcode'
import { Coordinates, PdfElement, mmToPt } from './pdfElements'

export type PdfQrCode = Extract<
  QrCode['qrCode'],
  { case: 'staticVerificationCode' | 'dynamicActivationCode' }
>

export type PdfQrCodeElementProps = {
  size: number
} & Coordinates

type PdfQrCodeElementRendererProps = {
  page: PDFPage
  qrCode: PdfQrCode
}

const pdfQrCodeElement: PdfElement<PdfQrCodeElementProps, PdfQrCodeElementRendererProps> = (
  { size, x, y },
  { page, qrCode },
) => {
  const qrCodeSizePdf = mmToPt(size)
  const qrCodeXPdf = mmToPt(x)
  const qrCodeYPdf = page.getSize().height - qrCodeSizePdf - mmToPt(y)

  const qrCodeContent = new QrCode({
    qrCode,
  }).toBinary()

  drawQRCode(qrCodeContent, qrCodeXPdf, qrCodeYPdf, qrCodeSizePdf, page, false)
}

export default pdfQrCodeElement
