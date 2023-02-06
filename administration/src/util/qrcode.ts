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

const DEFAULT_QUIET_ZONE_SIZE = 1
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
  // @ts-ignore
  const maskPattern = QRCodeEncoder.chooseMaskPattern(finalBits, ecLevel, version, matrix)
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
  let quietZone = DEFAULT_QUIET_ZONE_SIZE

  const { width, height } = { width: size, height: size }

  const code: QRCode = encodeQRCode(content)

  const input = code.getMatrix()

  if (input === null) {
    throw new IllegalStateException()
  }

  const inputWidth = input.getWidth()
  const inputHeight = input.getHeight()
  const qrWidth = inputWidth + quietZone * 2
  const qrHeight = inputHeight + quietZone * 2
  const outputWidth = Math.max(width, qrWidth)
  const outputHeight = Math.max(height, qrHeight)

  const multiple = Math.min(Math.floor(outputWidth / qrWidth), Math.floor(outputHeight / qrHeight))

  // Padding includes both the quiet zone and the extra white pixels to accommodate the requested
  // dimensions. For example, if input is 25x25 the QR will be 33x33 including the quiet zone.
  // If the requested size is 200x160, the multiple will be 4, for a QR of 132x132. These will
  // handle all the padding from 100x100 (the actual QR) up to 200x160.
  const leftPadding = Math.floor((outputWidth - inputWidth * multiple) / 2)
  const topPadding = Math.floor((outputHeight - inputHeight * multiple) / 2)

  renderBoundary(0, 0, outputWidth, outputHeight)

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
