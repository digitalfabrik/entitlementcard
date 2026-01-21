import { Color, PDFFont, PDFPage, RotationTypes } from '@cantoo/pdf-lib'

import { CardInfo } from '../../generated/card_pb'
import { Region } from '../../generated/graphql'
import { Card } from '../card'
import { Coordinates, mmToPt } from './pdfElements'

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

const pdfTextElement = (
  textElementProps: PdfTextElementProps,
  textRenderProps: PdfTextElementRendererProps,
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

export default pdfTextElement
