import { ACTIVATION_FRAGMENT, ACTIVATION_PATH } from 'build-configs/constants'

import { PdfQrCode } from '../cards/pdf/PdfQrCodeElement'
import { QrCode } from '../generated/card_pb'
import { uint8ArrayToBase64 } from './base64'

const generateDeepLink = (qrCode: PdfQrCode): string => {
  const qrCodeContent = new QrCode({
    qrCode: qrCode,
  }).toBinary()
  return `${window.location.origin}/${ACTIVATION_PATH}/${ACTIVATION_FRAGMENT}${encodeURIComponent(
    uint8ArrayToBase64(qrCodeContent)
  )}`
}
export default generateDeepLink
