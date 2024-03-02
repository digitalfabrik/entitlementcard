import { ACTIVATION_FRAGMENT, ACTIVATION_PATH, CUSTOM_SCHEME, HTTPS_SCHEME } from 'build-configs/constants'

import { PdfQrCode } from '../cards/pdf/PdfQrCodeElement'
import { QrCode } from '../generated/card_pb'
import { uint8ArrayToBase64 } from './base64'
import { isDevMode, isStagingMode } from './helper'

type DeepLinkScheme = typeof CUSTOM_SCHEME | typeof HTTPS_SCHEME

const getDeepLinkFromQrCode = (qrCode: PdfQrCode, projectId: string): string => {
  const qrCodeContent = new QrCode({
    qrCode: qrCode,
  }).toBinary()
  const scheme: DeepLinkScheme = isDevMode() ? CUSTOM_SCHEME : HTTPS_SCHEME
  const host = isDevMode() ? projectId : window.location.hostname
  const encodedActivationCodeBase64 = encodeURIComponent(uint8ArrayToBase64(qrCodeContent))
  const deepLink = `${scheme}://${host}/${ACTIVATION_PATH}/${ACTIVATION_FRAGMENT}${encodedActivationCodeBase64}`
  // Log deepLink for development and testing purposes
  if (isDevMode() || isStagingMode()) {
    console.log(deepLink)
  }
  return deepLink
}
export default getDeepLinkFromQrCode
