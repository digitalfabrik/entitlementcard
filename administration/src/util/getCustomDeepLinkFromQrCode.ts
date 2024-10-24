import { ACTIVATION_FRAGMENT, ACTIVATION_PATH } from 'build-configs/constants'

import { PdfQrCode } from '../cards/pdf/PdfQrCodeElement'
import { QrCode } from '../generated/card_pb'
import { uint8ArrayToBase64 } from './base64'
import { getBuildConfig } from './getBuildConfig'

const getCustomDeepLinkFromQrCode = (qrCode: PdfQrCode): string => {
  const qrCodeContent = new QrCode({ qrCode }).toBinary()
  const { deepLinking, projectId } = getBuildConfig(window.location.hostname).common
  const { production: host } = projectId
  const { customScheme } = deepLinking
  return `${customScheme}://${host}/${ACTIVATION_PATH}/${ACTIVATION_FRAGMENT}#${encodeURIComponent(
    uint8ArrayToBase64(qrCodeContent)
  )}/`
}
export default getCustomDeepLinkFromQrCode
