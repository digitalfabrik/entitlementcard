import { ACTIVATION_FRAGMENT, ACTIVATION_PATH, HTTPS_SCHEME } from 'build-configs/constants'

import { PdfQrCode } from '../cards/pdf/PdfQrCodeElement'
import { QrCode } from '../generated/card_pb'
import { uint8ArrayToBase64 } from './base64'
import { getBuildConfig } from './getBuildConfig'
import { isProductionEnvironment } from './helper'

const getDeepLinkFromQrCode = (qrCode: PdfQrCode): string => {
  const qrCodeContent = new QrCode({
    qrCode,
  }).toBinary()
  const buildConfigProjectId = getBuildConfig(window.location.hostname).common.projectId
  // custom link schemes don't work in browsers or pdf thats why we use the staging link scheme also for development
  const host = isProductionEnvironment() ? buildConfigProjectId.production : buildConfigProjectId.staging
  const deepLink = `${HTTPS_SCHEME}://${host}/${ACTIVATION_PATH}/${ACTIVATION_FRAGMENT}#${encodeURIComponent(
    uint8ArrayToBase64(qrCodeContent)
  )}/`
  if (!isProductionEnvironment()) {
    console.log(deepLink)
  }
  return deepLink
}
export default getDeepLinkFromQrCode
