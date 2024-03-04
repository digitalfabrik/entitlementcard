import { ACTIVATION_FRAGMENT, ACTIVATION_PATH, CUSTOM_SCHEME, HTTPS_SCHEME } from 'build-configs/constants'

import { PdfQrCode } from '../cards/pdf/PdfQrCodeElement'
import { QrCode } from '../generated/card_pb'
import { uint8ArrayToBase64 } from './base64'
import { getBuildConfig } from './getBuildConfig'
import { isDevMode, isStagingMode } from './helper'

type DeepLinkScheme = typeof CUSTOM_SCHEME | typeof HTTPS_SCHEME

const getDeepLinkFromQrCode = (qrCode: PdfQrCode): string => {
  const qrCodeContent = new QrCode({
    qrCode: qrCode,
  }).toBinary()
  const scheme: DeepLinkScheme = isDevMode() ? CUSTOM_SCHEME : HTTPS_SCHEME
  const buildConfigProjectId = getBuildConfig(window.location.hostname).common.projectId
  const host = isStagingMode() ? buildConfigProjectId.staging : buildConfigProjectId.production
  const deepLink = `${scheme}://${host}/${ACTIVATION_PATH}/${ACTIVATION_FRAGMENT}${encodeURIComponent(
    uint8ArrayToBase64(qrCodeContent)
  )}/`
  // Log deepLink for development and testing purposes
  if (isDevMode() || isStagingMode()) {
    console.log(deepLink)
  }
  return deepLink
}
export default getDeepLinkFromQrCode
