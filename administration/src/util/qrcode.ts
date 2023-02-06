import {
  IllegalStateException,
  QRCodeByteMatrix,
  QRCodeEncoder,
  QRCodeEncoderQRCode as QRCode,
  QRCodeMatrixUtil,
} from '@zxing/library'
import { PDFPage, rgb } from 'pdf-lib'
import { BitArray, QRCodeMode, QRCodeDecoderErrorCorrectionLevel, QRCodeVersion } from '@zxing/library'
import ECBlocks from '@zxing/library/esm/core/qrcode/decoder/ECBlocks'
import MatrixUtil from '@zxing/library/esm/core/qrcode/encoder/MatrixUtil'
import MaskUtil from '@zxing/library/esm/core/qrcode/encoder/MaskUtil'

const DEFAULT_QUIET_ZONE_SIZE = 4 // pt
const VERSION: QRCodeVersion = QRCodeVersion.getVersionForNumber(7)
const ERROR_CORRECTION: QRCodeDecoderErrorCorrectionLevel = QRCodeDecoderErrorCorrectionLevel.L

function calculateBitsNeeded(
  mode: QRCodeMode,
  headerBitsSize: number,
  dataBitsSize: number,
  version: QRCodeVersion
): number {
  return headerBitsSize + mode.getCharacterCountBits(version) + dataBitsSize
}

function willFit(
  mode: QRCodeMode,
  headerBitsSize: number,
  dataBitsSize: number,
  version: QRCodeVersion,
  ecLevel: QRCodeDecoderErrorCorrectionLevel
): boolean {
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

function chooseMaskPattern(
  bits: BitArray,
  ecLevel: QRCodeDecoderErrorCorrectionLevel,
  version: QRCodeVersion,
  matrix: QRCodeByteMatrix
): number {
  let minPenalty = Number.MAX_SAFE_INTEGER // Lower penalty is better.
  let bestMaskPattern = -1
  // We try all mask patterns to choose the best one.
  for (let maskPattern = 0; maskPattern < QRCode.NUM_MASK_PATTERNS; maskPattern++) {
    MatrixUtil.buildMatrix(bits, ecLevel, version, maskPattern, matrix)
    let penalty = calculateMaskPenalty(matrix)
    if (penalty < minPenalty) {
      minPenalty = penalty
      bestMaskPattern = maskPattern
    }
  }
  return bestMaskPattern
}

// The mask penalty calculation is complicated.  See Table 21 of JISX0510:2004 (p.45) for details.
// Basically it applies four rules and summate all penalties.
function calculateMaskPenalty(matrix: QRCodeByteMatrix): number {
  return (
    MaskUtil.applyMaskPenaltyRule1(matrix) +
    MaskUtil.applyMaskPenaltyRule2(matrix) +
    MaskUtil.applyMaskPenaltyRule3(matrix) +
    MaskUtil.applyMaskPenaltyRule4(matrix)
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
export function encodeQRCode(content: Uint8Array): QRCode {
  // Pick an encoding mode appropriate for the content.
  const mode: QRCodeMode = QRCodeMode.BYTE

  // This will store the header information, like mode and
  // length, as well as "header" segments like an ECI segment.
  const headerBits = new BitArray()

  // Do not append ECI segment, because we do not define the encoding of the QR code

  // (With ECI in place,) Write the mode marker
  QRCodeEncoder.appendModeInfo(mode, headerBits)

  // Collect data within the main segment, separately, to count its size if needed. Don't add it to
  // main payload yet.
  const dataBits = new BitArray()
  for (let i = 0, length = content.length; i !== length; i++) {
    const b = content[i]
    dataBits.appendBits(b, 8)
  }

  let version: QRCodeVersion = VERSION
  let ecLevel: QRCodeDecoderErrorCorrectionLevel = ERROR_CORRECTION

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

  const ecBlocks: ECBlocks = version.getECBlocksForLevel(ecLevel)
  const numDataBytes = version.getTotalCodewords() - ecBlocks.getTotalECCodewords()

  // Terminate the bits properly.
  QRCodeEncoder.terminateBits(numDataBytes, headerAndDataBits)

  // Interleave data bits with error correction code.
  const finalBits: BitArray = QRCodeEncoder.interleaveWithECBytes(
    headerAndDataBits,
    version.getTotalCodewords(),
    numDataBytes,
    ecBlocks.getNumBlocks()
  )

  const qrCode = new QRCode()

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

// Adapted from https://github.com/zxing-js/library/blob/d1a270cb8ef3c4dba72966845991f5c876338aac/src/browser/BrowserQRCodeSvgWriter.ts#L91
const createQRCode = (
  content: Uint8Array,
  renderRect: (x: number, y: number, size: number) => void,
  renderBoundary: (x: number, y: number, width: number, height: number) => void,
  size: number
) => {
  const code: QRCode = encodeQRCode(content)
  let quietZone = DEFAULT_QUIET_ZONE_SIZE

  const input = code.getMatrix()

  if (input === null) {
    throw new IllegalStateException()
  }

  const inputWidth = input.getWidth()
  const inputHeight = input.getHeight()

  if (inputWidth !== inputHeight) {
    throw new IllegalStateException('QRCode is not quadratic')
  }
  const requestedSize = size - quietZone * 2

  const multiple = requestedSize / inputWidth

  const leftPadding = quietZone
  const topPadding = quietZone

  renderBoundary(0, 0, size, size)

  for (let inputY = 0; inputY < inputHeight; inputY++) {
    // Write the contents of this row of the barcode
    for (let inputX = 0; inputX < inputWidth; inputX++) {
      if (input.get(inputX, inputY) === 1) {
        const outputX = leftPadding + inputX * multiple
        const outputY = topPadding + inputY * multiple
        renderRect(outputX, outputY, multiple)
      }
    }
  }
}

export const drawQRCode = (
  content: Uint8Array,
  x: number,
  y: number,
  size: number,
  pdfDocument: PDFPage,
  border: boolean = true
) => {
  createQRCode(
    content,
    (rectX: number, rectY: number, rectSize: number) => {
      pdfDocument.drawRectangle({
        x: x + rectX,
        y: y + (size - rectY),
        width: rectSize,
        height: -rectSize,
      })
    },
    (rectX: number, rectY: number, rectWidth: number, rectHeight: number) => {
      if (border) {
        pdfDocument.drawRectangle({
          x: x + rectX,
          y: y + rectY,
          width: rectWidth,
          height: rectHeight,
          borderWidth: 1,
          color: rgb(1, 1, 1),
        })
      }
    },
    size
  )
}
