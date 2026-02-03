import { ACTIVATION_FRAGMENT, ACTIVATION_PATH } from 'build-configs/constants'

import { QrCode } from '../generated/card_pb'
import { ProjectConfig } from '../project-configs/getProjectConfig'
import { getBuildConfig } from '../util/getBuildConfig'
import { uint8ArrayToBase64 } from './base64'
import { PdfQrCode } from './pdf/pdfQrCodeElement'

const getCustomDeepLinkFromQrCode = (projectConfig: ProjectConfig, qrCode: PdfQrCode): string => {
  const qrCodeContent = new QrCode({ qrCode }).toBinary()
  const { deepLinking, projectId } = getBuildConfig(projectConfig.projectId).common
  const { production: host } = projectId
  const { customScheme } = deepLinking
  return `${customScheme}://${host}/${ACTIVATION_PATH}/${ACTIVATION_FRAGMENT}#${encodeURIComponent(
    uint8ArrayToBase64(qrCodeContent),
  )}`
}
export default getCustomDeepLinkFromQrCode
