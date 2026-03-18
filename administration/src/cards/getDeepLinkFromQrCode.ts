import { create, toBinary } from '@bufbuild/protobuf'
import { ACTIVATION_FRAGMENT, ACTIVATION_PATH, BuildConfigType, HTTPS_SCHEME } from 'build-configs'

import { QrCodeSchema } from '../generated/card_pb'
import { uint8ArrayToBase64 } from './base64'
import type { PdfQrCode } from './pdf/elements'

const getDeepLinkFromQrCode = (
  qrCode: PdfQrCode,
  buildConfig: BuildConfigType,
  isProduction: boolean,
): string => {
  const qrCodeContent = toBinary(
    QrCodeSchema,
    create(QrCodeSchema, {
      qrCode,
    }),
  )
  const buildConfigProjectId = buildConfig.common.projectId
  // Custom link schemes do not work in browsers or PDFs, so use the staging link scheme also for development
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
