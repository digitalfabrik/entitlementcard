// Most of the functions are from https://github.com/zxing-js/library
import {
  BitArray,
  QRCodeByteMatrix,
  QRCodeDecoderErrorCorrectionLevel,
  QRCodeEncoder,
  QRCodeEncoderQRCode,
  QRCodeMaskUtil,
  QRCodeMatrixUtil,
  QRCodeMode,
  QRCodeVersion,
} from '@zxing/library/cjs'

import { QrCode } from '../generated/card_pb'

// Level 8 with EC of M gives 152 bytes
// Level 7 with EC of L gives 154 bytes
// Level 8 seems appropriate right now.
const DEFAULT_VERSION: QRCodeVersion = QRCodeVersion.getVersionForNumber(8)
// From EC L to M we have a double of EC capability: 7% -> 15%
const DEFAULT_ERROR_CORRECTION: QRCodeDecoderErrorCorrectionLevel =
  QRCodeDecoderErrorCorrectionLevel.M

// Adapted and modified from https://github.com/zxing-js/library/blob/5719e939f2fc513f71627c3f37c227e26efe06c1/src/core/qrcode/encoder/Encoder.ts#L189
const calculateBitsNeeded = (
  mode: QRCodeMode,
  headerBitsSize: number,
  dataBitsSize: number,
  version: QRCodeVersion,
): number => headerBitsSize + mode.getCharacterCountBits(version) + dataBitsSize

// Adapted and modified from https://github.com/zxing-js/library/blob/5719e939f2fc513f71627c3f37c227e26efe06c1/src/core/qrcode/encoder/Encoder.ts#L294
const willFit = (
  mode: QRCodeMode,
  headerBitsSize: number,
  dataBitsSize: number,
  version: QRCodeVersion,
  ecLevel: QRCodeDecoderErrorCorrectionLevel,
): boolean => {
  // In the following comments, we use numbers of Version 7-H.
  // numBytes = 196
  const numBytes = version.getTotalCodewords()
  // getNumECBytes = 130
  const ecBlocks = version.getECBlocksForLevel(ecLevel)
  const numEcBytes = ecBlocks.getTotalECCodewords()
  // getNumDataBytes = 196 - 130 = 66
  const numDataBytes = numBytes - numEcBytes
  const totalInputBytes = (calculateBitsNeeded(mode, headerBitsSize, dataBitsSize, version) + 7) / 8
  return numDataBytes >= totalInputBytes
}

// The mask penalty calculation is complicated.  See Table 21 of JISX0510:2004 (p.45) for details.
// Basically, it applies four rules and summates all penalties.
// Adapted from https://github.com/zxing-js/library/blob/5719e939f2fc513f71627c3f37c227e26efe06c1/src/core/qrcode/encoder/Encoder.ts#L65
const calculateMaskPenalty = (matrix: QRCodeByteMatrix): number =>
  QRCodeMaskUtil.applyMaskPenaltyRule1(matrix) +
  QRCodeMaskUtil.applyMaskPenaltyRule2(matrix) +
  QRCodeMaskUtil.applyMaskPenaltyRule3(matrix) +
  QRCodeMaskUtil.applyMaskPenaltyRule4(matrix)

// Adapted from https://github.com/zxing-js/library/blob/5719e939f2fc513f71627c3f37c227e26efe06c1/src/core/qrcode/encoder/Encoder.ts#L261
const chooseMaskPattern = (
  bits: BitArray,
  ecLevel: QRCodeDecoderErrorCorrectionLevel,
  version: QRCodeVersion,
  matrix: QRCodeByteMatrix,
): number => {
  let minPenalty = Number.MAX_SAFE_INTEGER // Lower penalty is better.
  let bestMaskPattern = -1
  // We try all mask patterns to choose the best one.
  for (let maskPattern = 0; maskPattern < QRCodeEncoderQRCode.NUM_MASK_PATTERNS; maskPattern++) {
    QRCodeMatrixUtil.buildMatrix(bits, ecLevel, version, maskPattern, matrix)
    const penalty = calculateMaskPenalty(matrix)
    if (penalty < minPenalty) {
      minPenalty = penalty
      bestMaskPattern = maskPattern
    }
  }
  return bestMaskPattern
}

const createHeader = (mode: QRCodeMode) => {
  // This will store the header information, like mode and
  // length, as well as "header" segments like an ECI segment.
  const headerBits = new BitArray()

  // Do not append ECI segment, because we do not define the encoding of the QR code

  // (With ECI in place,) Write the mode marker
  QRCodeEncoder.appendModeInfo(mode, headerBits)
  return headerBits
}

export const isContentLengthValid = (content: Uint8Array): boolean => {
  const mode = QRCodeMode.BYTE
  return willFit(
    mode,
    createHeader(mode).getSize(),
    content.length * 8,
    DEFAULT_VERSION,
    DEFAULT_ERROR_CORRECTION,
  )
}

/**
 * This function has been copied and modified from https://github.com/zxing-js/library/blob/5719e939f2fc513f71627c3f37c227e26efe06c1/src/core/qrcode/encoder/Encoder.ts#L83
 * The main changes are:
 * * Do not include ECI segment because we do not have a text encoding (we have binary data)
 * * Append data as binary using `appendBits`
 *
 * @param content binary content
 */
export const encodeQRCode = (content: Uint8Array): QRCodeEncoderQRCode => {
  // Pick an encoding mode appropriate for the content.
  const mode: QRCodeMode = QRCodeMode.BYTE

  const headerBits = createHeader(mode)

  // Collect data within the main segment, separately, to count its size if needed. Don't add it to
  // main payload yet.
  const dataBits = new BitArray()
  for (let i = 0, length = content.length; i !== length; i++) {
    const b = content[i]
    dataBits.appendBits(b, 8)
  }

  const version: QRCodeVersion = DEFAULT_VERSION
  const ecLevel: QRCodeDecoderErrorCorrectionLevel = DEFAULT_ERROR_CORRECTION

  if (!willFit(mode, headerBits.getSize(), dataBits.getSize(), version, ecLevel)) {
    throw new Error('Data too big for requested version')
  }

  const headerAndDataBits = new BitArray()
  headerAndDataBits.appendBitArray(headerBits)
  // Find "length" of main segment and write it
  const length = dataBits.getSizeInBytes()

  QRCodeEncoder.appendLengthInfo(length, version, mode, headerAndDataBits)
  // Put data together into the overall payload
  headerAndDataBits.appendBitArray(dataBits)

  const ecBlocks = version.getECBlocksForLevel(ecLevel)
  const numDataBytes = version.getTotalCodewords() - ecBlocks.getTotalECCodewords()

  // Terminate the bits properly.
  QRCodeEncoder.terminateBits(numDataBytes, headerAndDataBits)

  // Interleave data bits with error correction code.
  const finalBits: BitArray = QRCodeEncoder.interleaveWithECBytes(
    headerAndDataBits,
    version.getTotalCodewords(),
    numDataBytes,
    ecBlocks.getNumBlocks(),
  )

  const qrCode = new QRCodeEncoderQRCode()

  qrCode.setECLevel(ecLevel)
  qrCode.setMode(mode)
  qrCode.setVersion(version)

  //  Choose the mask pattern and set to "qrCode".
  const dimension = version.getDimensionForVersion()
  const matrix: QRCodeByteMatrix = new QRCodeByteMatrix(dimension, dimension)
  const maskPattern = chooseMaskPattern(finalBits, ecLevel, version, matrix)
  qrCode.setMaskPattern(maskPattern)

  // Build the matrix and set it to "qrCode".
  QRCodeMatrixUtil.buildMatrix(finalBits, ecLevel, version, maskPattern, matrix)
  qrCode.setMatrix(matrix)

  return qrCode
}

export const convertProtobufToHexCode = (qrCode: QrCode): string => {
  const qrCodeMatrix = encodeQRCode(qrCode.toBinary()).getMatrix()
  return qrCodeMatrix
    .getArray()
    .map(row => BigInt(`0b${row.join('')}`).toString(16))
    .join('-')
}

export const convertHexmapToUInt8Array = (hexmap: string): Uint8Array[] => {
  const hexRows = hexmap.split('-')
  const binaryStringMatrix = hexRows.map(hex =>
    BigInt(`0x${hex}`).toString(2).padStart(hexRows.length, '0'),
  )
  return binaryStringMatrix.map(stringRow => Uint8Array.from(stringRow.split(''), x => Number(x)))
}
