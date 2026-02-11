import {
  PDFDocument,
  PDFFont,
  PDFForm,
  PDFPage,
  PDFString,
  RotationTypes,
  grayscale,
} from '@cantoo/pdf-lib'

import { CardInfo, QrCode } from '../../generated/card_pb'
import { type Region } from '../../generated/graphql'
import {
  PdfFormElementProps,
  PdfLinkAreaProps,
  PdfQrCodeElementProps,
  PdfTextElementProps,
} from '../../project-configs'
import { encodeQRCode } from '../../util/qrcode'
import { Card } from '../card'

const mmToPt = (mm: number): number => (mm / 25.4) * 72
const DEFAULT_QUIET_ZONE_SIZE = 4 // pt

export const pdfFormElement = (
  formElementProps: PdfFormElementProps,
  formRenderProps: {
    page: PDFPage
    form: PDFForm
    font: PDFFont
    info: CardInfo
    card: Card
    cardInfoHash: string
    region?: Region
  },
): void => {
  const pageIdx = formRenderProps.page.doc.getPageCount()
  const formFields = formElementProps.infoToFormFields(formRenderProps.form, pageIdx, {
    info: formRenderProps.info,
    region: formRenderProps.region,
    card: formRenderProps.card,
    cardInfoHash: formRenderProps.cardInfoHash,
  })
  const lineHeight = formRenderProps.font.heightAtSize(formElementProps.fontSize) + 6

  formFields.forEach((formField, index) => {
    formField.addToPage(formRenderProps.page, {
      x: mmToPt(formElementProps.x),
      y: formRenderProps.page.getSize().height - mmToPt(formElementProps.y) - lineHeight * index,
      borderColor: grayscale(1),
      height: lineHeight,
      width: mmToPt(formElementProps.width),
      font: formRenderProps.font,
    })
    formField.enableCombing()
    formField.setFontSize(formElementProps.fontSize)
  })

  // form.flatten()
}

export const pdfLinkArea = (
  linkAreaElementProps: PdfLinkAreaProps,
  linkAreaRenderProps: {
    doc: PDFDocument
    page: PDFPage
    font: PDFFont
    url: string
  },
): void => {
  const deepLinkAreaSize = mmToPt(linkAreaElementProps.size)
  const deepLinkAreaX = mmToPt(linkAreaElementProps.x)
  const deepLinkAreaY =
    linkAreaRenderProps.page.getSize().height - deepLinkAreaSize - mmToPt(linkAreaElementProps.y)
  const link = linkAreaRenderProps.doc.context.register(
    linkAreaRenderProps.doc.context.obj({
      Type: 'Annot',
      Subtype: 'Link',
      /* Bounds of the link on the page */
      Rect: [
        deepLinkAreaX, // lower left x coord
        deepLinkAreaY, // lower left y coord
        deepLinkAreaX + deepLinkAreaSize, // upper right x coord
        deepLinkAreaY + deepLinkAreaSize, // upper right y coord
      ],
      // override default border
      Border: [0, 0, 0],
      // /* C: [2, 2, 1], */
      // URI Action
      A: { Type: 'Action', S: 'URI', URI: PDFString.of(linkAreaRenderProps.url) },
    }),
  )

  linkAreaRenderProps.page.node.addAnnot(link)
}

export type PdfQrCode = Extract<
  QrCode['qrCode'],
  { case: 'staticVerificationCode' | 'dynamicActivationCode' }
>

export const pdfQrCodeElement = (
  page: PDFPage,
  qrCode: PdfQrCode,
  qrCodeElementProps: PdfQrCodeElementProps,
): void => {
  const qrCodeSizePdf = mmToPt(qrCodeElementProps.size)
  const qrCodeXPdf = mmToPt(qrCodeElementProps.x)
  const qrCodeYPdf = page.getSize().height - qrCodeSizePdf - mmToPt(qrCodeElementProps.y)
  const qrCodeMatrix = encodeQRCode(new QrCode({ qrCode }).toBinary()).getMatrix()
  const inputWidth = qrCodeMatrix.getWidth()
  const inputHeight = qrCodeMatrix.getHeight()
  const requestedSize = qrCodeSizePdf - DEFAULT_QUIET_ZONE_SIZE * 2
  const dotSize = requestedSize / inputWidth
  const leftPadding = DEFAULT_QUIET_ZONE_SIZE
  const topPadding = DEFAULT_QUIET_ZONE_SIZE

  if (inputWidth !== inputHeight) {
    throw new Error('QRCode is not quadratic')
  }

  for (let y = 0; y < inputHeight; y++) {
    for (let x = 0; x < inputWidth; x++) {
      if (qrCodeMatrix.get(x, y) === 1) {
        page.drawRectangle({
          x: qrCodeXPdf + leftPadding + x * dotSize,
          y: qrCodeYPdf + (qrCodeSizePdf - (topPadding + y * dotSize)),
          width: dotSize,
          height: -dotSize,
        })
      }
    }
  }
}

export const pdfTextElement = (
  textElementProps: PdfTextElementProps,
  textRenderProps: {
    page: PDFPage
    font: PDFFont
    info: CardInfo
    card: Card
    cardInfoHash: string
    region?: Region
  },
): void => {
  const spacing = textElementProps.spacing === undefined ? 1 : textElementProps.spacing
  const angle = textElementProps.angle === undefined ? 0 : textElementProps.angle
  const color = textElementProps.color === undefined ? undefined : textElementProps.color
  const textAlign = textElementProps.textAlign === undefined ? 'left' : textElementProps.textAlign
  const text = textElementProps.infoToText({
    info: textRenderProps.info,
    region: textRenderProps.region,
    card: textRenderProps.card,
    cardInfoHash: textRenderProps.cardInfoHash,
  })
  let xPt: number

  switch (textAlign) {
    case 'left':
      xPt = mmToPt(textElementProps.x)
      break
    case 'right':
      xPt =
        mmToPt(textElementProps.x) -
        textRenderProps.font.widthOfTextAtSize(text, textElementProps.fontSize)
      break
    case 'center':
      xPt =
        mmToPt(textElementProps.x) -
        textRenderProps.font.widthOfTextAtSize(text, textElementProps.fontSize) / 2
      break
  }

  const lineHeight = textRenderProps.font.heightAtSize(textElementProps.fontSize) + spacing

  textRenderProps.page.drawText(text, {
    font: textRenderProps.font,
    x: xPt,
    y: textRenderProps.page.getSize().height - mmToPt(textElementProps.y) - lineHeight,
    maxWidth:
      textElementProps.maxWidth !== undefined ? mmToPt(textElementProps.maxWidth) : undefined,
    wordBreaks: text.split('').filter(c => !'\n\f\r\u000B'.includes(c)), // Split on every character
    lineHeight,
    color,
    rotate: { angle, type: RotationTypes.Degrees },
    size: textElementProps.fontSize,
  })
}
