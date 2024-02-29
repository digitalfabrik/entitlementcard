import { ACTIVATION_FRAGMENT, ACTIVATION_PATH, CUSTOM_SCHEME, HTTPS_SCHEME } from 'build-configs/constants'

import { PdfQrCode } from '../cards/pdf/PdfQrCodeElement'
import { QrCode } from '../generated/card_pb'
import { uint8ArrayToBase64 } from './base64'
import { isDevMode, isStagingMode } from './helper'

type DeepLinkSchemeTypes = typeof CUSTOM_SCHEME | typeof HTTPS_SCHEME

const generateDeepLink = (qrCode: PdfQrCode, projectId: string): string => {
  const qrCodeContent = new QrCode({
    qrCode: qrCode,
  }).toBinary()
  const scheme: DeepLinkSchemeTypes = isDevMode() ? CUSTOM_SCHEME : HTTPS_SCHEME
  const host = isDevMode() ? projectId : window.location.hostname
  const deepLink = `${scheme}://${host}/${ACTIVATION_PATH}/${ACTIVATION_FRAGMENT}${encodeURIComponent(
    uint8ArrayToBase64(qrCodeContent)
  )}`
  // Log deepLink for development and testing purposes
  if (isDevMode() || isStagingMode()) {
    console.log(deepLink)
  }
  return deepLink
}
export default generateDeepLink
