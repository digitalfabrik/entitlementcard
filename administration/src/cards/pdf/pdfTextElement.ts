import { Color, ColorTypes, PDFFont, PDFPage, RotationTypes } from 'pdf-lib'

import { CardInfo } from '../../generated/card_pb'
import { Region } from '../../generated/graphql'
import CardBlueprint from '../CardBlueprint'
import { Coordinates, PdfElement, mmToPt } from './PdfElements'

export type InfoParams = {
  info: CardInfo
  region: Region
  cardBlueprint: CardBlueprint
}

export type PdfTextElementProps = {
  width: number
  fontSize: number
  spacing?: number
  angle?: number
  color?: Color
  infoToText: (info: InfoParams) => string
} & Coordinates

type PdfTextElementRendererProps = {
  page: PDFPage
  font: PDFFont
  info: CardInfo
  region: Region
  cardBlueprint: CardBlueprint
}

const pdfTextElement: PdfElement<PdfTextElementProps, PdfTextElementRendererProps> = (
  { width, x, y, fontSize, infoToText, spacing = 1, angle = 0, color = undefined },
  { page, font, info, region, cardBlueprint }
) => {
  const text = infoToText({ info, region, cardBlueprint })

  const lineHeight = font.heightAtSize(fontSize) + spacing

  page.drawText(text, {
    font,
    x: mmToPt(x),
    y: page.getSize().height - mmToPt(y) - lineHeight,
    maxWidth: mmToPt(width),
    wordBreaks: text.split('').filter(c => !'\n\f\r\u000B'.includes(c)), // Split on every character
    lineHeight,
    color,
    rotate: { angle: angle, type: RotationTypes.Degrees },
    size: fontSize,
  })
}

export default pdfTextElement
