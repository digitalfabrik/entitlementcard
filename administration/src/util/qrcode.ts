import {
  EncodeHintType,
  IllegalStateException,
  QRCodeDecoderErrorCorrectionLevel as ErrorCorrectionLevel,
  QRCodeEncoder,
  QRCodeEncoderQRCode as QRCode,
} from '@zxing/library'
import { PDFPage, rgb } from 'pdf-lib'

const DEFAULT_QUIET_ZONE_SIZE = 10

// Adapted from https://github.com/zxing-js/library/blob/d1a270cb8ef3c4dba72966845991f5c876338aac/src/browser/BrowserQRCodeSvgWriter.ts#L91
const createQRCode = (
  text: string,
  renderRect: (x: number, y: number, size: number) => void,
  renderBoundary: (x: number, y: number, width: number, height: number) => void,
  size: number,
  hints?: Map<EncodeHintType, any>
) => {
  let errorCorrectionLevel = ErrorCorrectionLevel.L
  let quietZone = DEFAULT_QUIET_ZONE_SIZE
  const { width, height } = { width: size, height: size }

  if (hints) {
    if (hints.get(EncodeHintType.ERROR_CORRECTION)) {
      errorCorrectionLevel = ErrorCorrectionLevel.fromString(hints.get(EncodeHintType.ERROR_CORRECTION).toString())
    }

    if (hints.get(EncodeHintType.MARGIN) !== undefined) {
      quietZone = Number.parseInt(hints.get(EncodeHintType.MARGIN).toString(), 10)
    }
  }

  const code: QRCode = QRCodeEncoder.encode(text, errorCorrectionLevel, hints)

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
  text: string,
  x: number,
  y: number,
  size: number,
  pdfDocument: PDFPage,
  border: boolean = true,
  version = 7
) => {
  const hints = new Map()
  hints.set(EncodeHintType.MARGIN, 0)
  hints.set(EncodeHintType.QR_VERSION, version)
  createQRCode(
    text,
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
    size,
    hints
  )
}
