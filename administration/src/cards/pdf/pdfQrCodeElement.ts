import { PDFPage } from '@cantoo/pdf-lib'

import { QrCode } from '../../generated/card_pb'
import { drawQRCode } from '../../util/qrcode'
import { Coordinates, mmToPt } from './pdfElements'

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

const pdfQrCodeElement = (
  qrCodeElementProps: PdfQrCodeElementProps,
  qrCodeRenderProps: PdfQrCodeElementRendererProps,
): void => {
  const qrCodeSizePdf = mmToPt(qrCodeElementProps.size)
  const qrCodeXPdf = mmToPt(qrCodeElementProps.x)
  const qrCodeYPdf =
    qrCodeRenderProps.page.getSize().height - qrCodeSizePdf - mmToPt(qrCodeElementProps.y)

  const qrCodeContent = new QrCode({
    qrCode: qrCodeRenderProps.qrCode,
  }).toBinary()

  drawQRCode(qrCodeContent, qrCodeXPdf, qrCodeYPdf, qrCodeSizePdf, qrCodeRenderProps.page, false)
}

export default pdfQrCodeElement
