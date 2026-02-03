import { DynamicActivationCode, QrCode, StaticVerificationCode } from '../generated/card_pb'
import { convertHexmapToUInt8Array, convertProtobufToHexCode, encodeQRCode } from './qrcode'

describe('qrcode', () => {
  describe('protobuf to hex converter', () => {
    it('should return correct hex', () => {
      const cardInfo = {
        fullName: 'Thea Test',
        expirationDay: 1,
      }
      const protobufQRCode: DynamicActivationCode = new DynamicActivationCode({ info: cardInfo })

      const qrCode = new QrCode({
        qrCode: {
          case: 'dynamicActivationCode',
          value: protobufQRCode,
        },
      })

      const hex = convertProtobufToHexCode(qrCode)
      expect(hex).toBe(
        '1fc6414f9417f-1040eaa17af41-175f545cab35d-1750b8e60925d-1754537cab85d-1054454649441-1fd555555557f-1413c4a7e00-17cbaefe0d67c-789704ca7d9b-186406e249371-140c847ca7d2b-1b5396960d4c1-a498bca5ee5-44a52124b0cd-10ba4bc6b2a4-16689016c1808-c97a3bc6b2a7-4c4912c1845-c9403b24928b-cca7c19f2309-1284dbb358895-17ff8dfdfa9fe-b14a74649314-1557d4d5f295a-717b7c758315-5fc1dfdf29fe-1125fda4a254-145a44b1f3b6a-1c8fcbdb5a2c9-1c9a1b1f1a61-188e675a85fcb-1572ce513e4c1-507242b94d7d-d78b6c17a0de-16348428a7b38-1cc706520d04a-184d428a79fb-8f5d2c249451-e235428a7dfb-1c62c27e0d7f1-11bc44a7f1b-1fc75ad649351-1050a444a6f1b-1759b27e0f5f1-1755749ca7e47-1752ca664b1cd-104848cc6b365-1fd6d862c19fb',
      )
    })

    it('should be the same staticVerificationCode after converting back', () => {
      const cardInfo = {
        fullName: 'Thea Test',
        expirationDay: 20165,
      }
      const protobufQRCode: StaticVerificationCode = new StaticVerificationCode({ info: cardInfo })

      const qrCode = new QrCode({
        qrCode: {
          case: 'staticVerificationCode',
          value: protobufQRCode,
        },
      })
      const expectedBinary = encodeQRCode(qrCode.toBinary()).getMatrix().getArray()

      const hex = convertProtobufToHexCode(qrCode)
      const binary = convertHexmapToUInt8Array(hex)

      expect(expectedBinary).toEqual(binary)
    })

    it('should be the same dynamicActivationCode after converting back with special chars', () => {
      const cardInfo = {
        fullName: 'John Müller',
        expirationDay: 25000,
      }
      const protobufQRCode: DynamicActivationCode = new DynamicActivationCode({ info: cardInfo })
      const qrCode = new QrCode({
        qrCode: {
          case: 'dynamicActivationCode',
          value: protobufQRCode,
        },
      })
      const expectedBinary = encodeQRCode(qrCode.toBinary()).getMatrix().getArray()

      const hex = convertProtobufToHexCode(qrCode)
      const binary = convertHexmapToUInt8Array(hex)

      expect(expectedBinary).toEqual(binary)
    })
  })
})
