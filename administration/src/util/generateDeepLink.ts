import { ACTIVATION_FRAGMENT, ACTIVATION_PATH, CUSTOM_SCHEME, HTTPS_SCHEME } from 'build-configs'

import { PdfQrCode } from '../cards/pdf/PdfQrCodeElement'
import { QrCode } from '../generated/card_pb'
import { uint8ArrayToBase64 } from './base64'
import { getBuildConfig } from './getProjectConfig'
import { isDevMode, isStagingMode } from './helper'

type DeepLinkSchemeTypes = typeof CUSTOM_SCHEME | typeof HTTPS_SCHEME

const generateDeepLink = (qrCode: PdfQrCode): string => {
  const qrCodeContent = new QrCode({
    qrCode: qrCode,
  }).toBinary()
  const scheme: DeepLinkSchemeTypes = isDevMode() ? CUSTOM_SCHEME : HTTPS_SCHEME
  const buildConfig = getBuildConfig(window.location.hostname)
  const host = isStagingMode() ? buildConfig.common.projectId.staging : buildConfig.common.projectId.production
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
