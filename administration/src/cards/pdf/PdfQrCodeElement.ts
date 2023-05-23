import { PDFPage } from 'pdf-lib'

import { QrCode } from '../../generated/card_pb'
import { drawQRCode } from '../../util/qrcode'
import { Coordinates, PdfElement, PdfElementRenderer, mmToPt } from './PdfElements'

type PdfQrCode = Extract<QrCode['qrCode'], { case: 'staticVerificationCode' | 'dynamicActivationCode' }>

type PdfQrCodeElementProps = {
  size: number
} & Coordinates

type PdfQrCodeElementRendererProps = {
  page: PDFPage
  qrCode: PdfQrCode
}

export type PdfQrCodeElementRenderer = PdfElementRenderer<PdfQrCodeElementRendererProps>

const PdfQrCodeElement: PdfElement<PdfQrCodeElementProps, PdfQrCodeElementRendererProps> =
  ({ size, x, y }) =>
  ({ page, qrCode }) => {
    const qrCodeSizePdf = mmToPt(size)
    const qrCodeXPdf = mmToPt(x)
    const qrCodeYPdf = page.getSize().height - qrCodeSizePdf - mmToPt(y)

    const qrCodeContent = new QrCode({
      qrCode: qrCode,
    }).toBinary()

    drawQRCode(qrCodeContent, qrCodeXPdf, qrCodeYPdf, qrCodeSizePdf, page, false)
  }

export default PdfQrCodeElement
