import { DynamicActivationCode } from '../../generated/card_pb'
import koblenzConfig from '../../project-configs/koblenz/config'
import { mockedCardMutation } from '../../routes/erstellen/__mock__/mockSelfServiceCard'
import { base64ToUint8Array } from '../base64'
import getCustomDeepLinkFromQrCode from '../getCustomDeepLinkFromQrCode'
import { PdfQrCode } from '../pdf/PdfQrCodeElement'

jest.useFakeTimers({ now: new Date('2024-01-01T00:00:00.000Z') })

describe('getCustomDeepLinkFromQrCode', () => {
  const dynamicPdfQrCode: PdfQrCode = {
    case: 'dynamicActivationCode',
    value: DynamicActivationCode.fromBinary(
      base64ToUint8Array(mockedCardMutation.result.data.card.dynamicActivationCode.codeBase64)
    ),
  }

  it('should generate correct deep link', () => {
    expect(getCustomDeepLinkFromQrCode(koblenzConfig, dynamicPdfQrCode)).toBe(
      'koblenzpass://koblenz.sozialpass.app/activation/code#ClcKLQoNS2FybGEgS29ibGVuehDmnwEaGAoCCF8SBAjqvgEqBAiLmgEyBgoEMTIzSxIQL%2Fle3xYGNIKS50god4ITmxoUOUYGq%2FjAE99bK4edMPo2I3ojr78%3D'
    )
  })
})
