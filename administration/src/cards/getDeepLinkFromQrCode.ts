import { ACTIVATION_FRAGMENT, ACTIVATION_PATH, BuildConfigType, HTTPS_SCHEME } from 'build-configs'

import { QrCode } from '../generated/card_pb'
import { uint8ArrayToBase64 } from './base64'
import type { PdfQrCode } from './pdf/elements'

const getDeepLinkFromQrCode = (
  qrCode: PdfQrCode,
  buildConfig: BuildConfigType,
  isProduction: boolean,
): string => {
  const qrCodeContent = new QrCode({
    qrCode,
  }).toBinary()
  const buildConfigProjectId = buildConfig.common.projectId
  // custom link schemes don't work in browsers or pdf thats why we use the staging link scheme also for development
  const host = isProduction ? buildConfigProjectId.production : buildConfigProjectId.staging
  const deepLink = `${HTTPS_SCHEME}://${host}/${ACTIVATION_PATH}/${ACTIVATION_FRAGMENT}#${encodeURIComponent(
    uint8ArrayToBase64(qrCodeContent),
  )}`
  if (!isProduction) {
    console.log(deepLink)
  }
  return deepLink
}

export default getDeepLinkFromQrCode
