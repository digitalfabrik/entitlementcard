import { Color, PDFFont, PDFPage, RotationTypes } from 'pdf-lib'

import { CardInfo } from '../../generated/card_pb'
import { Region } from '../../generated/graphql'
import { Card } from '../Card'
import { Coordinates, PdfElement, mmToPt } from './PdfElements'

export type InfoParams = {
  info: CardInfo
  card: Card
  cardInfoHash: string
  region?: Region
}

export type PdfTextElementProps = {
  bold?: boolean
  maxWidth?: number | undefined
  fontSize: number
  textAlign?: 'left' | 'right' | 'center'
  spacing?: number
  angle?: number | undefined
  color?: Color
  infoToText: (info: InfoParams) => string
} & Coordinates

type PdfTextElementRendererProps = {
  page: PDFPage
  font: PDFFont
  info: CardInfo
  card: Card
  cardInfoHash: string
  region?: Region
}

const pdfTextElement: PdfElement<PdfTextElementProps, PdfTextElementRendererProps> = (
  { maxWidth, x, y, fontSize, infoToText, spacing = 1, angle = 0, color = undefined, textAlign = 'left' },
  { page, font, info, region, card, cardInfoHash }
) => {
  const text = infoToText({ info, region, card, cardInfoHash })

  let xPt: number
  switch (textAlign) {
    case 'left':
      xPt = mmToPt(x)
      break
    case 'right':
      xPt = mmToPt(x) - font.widthOfTextAtSize(text, fontSize)
      break
    case 'center':
      xPt = mmToPt(x) - font.widthOfTextAtSize(text, fontSize) / 2
      break
  }

  const lineHeight = font.heightAtSize(fontSize) + spacing

  page.drawText(text, {
    font,
    x: xPt,
    y: page.getSize().height - mmToPt(y) - lineHeight,
    maxWidth: maxWidth !== undefined ? mmToPt(maxWidth) : undefined,
    wordBreaks: text.split('').filter(c => !'\n\f\r\u000B'.includes(c)), // Split on every character
    lineHeight,
    color,
    rotate: { angle, type: RotationTypes.Degrees },
    size: fontSize,
  })
}

export default pdfTextElement
