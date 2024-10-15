import { ACTIVATION_FRAGMENT, ACTIVATION_PATH, CUSTOM_SCHEME } from 'build-configs/constants'

import { PdfQrCode } from '../cards/pdf/PdfQrCodeElement'
import { QrCode } from '../generated/card_pb'
import { uint8ArrayToBase64 } from './base64'
import { getBuildConfig } from './getBuildConfig'

const getCustomDeepLinkFromQrCode = (qrCode: PdfQrCode): string => {
  const qrCodeContent = new QrCode({ qrCode }).toBinary()
  const host = getBuildConfig(window.location.hostname).common.projectId.production
  return `${CUSTOM_SCHEME}://${host}/${ACTIVATION_PATH}/${ACTIVATION_FRAGMENT}#${encodeURIComponent(
    uint8ArrayToBase64(qrCodeContent)
  )}/`
}
export default getCustomDeepLinkFromQrCode
