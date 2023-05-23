import { PDFFont, PDFPage } from 'pdf-lib'

import { CardInfo } from '../../generated/card_pb'
import { Region } from '../../generated/graphql'
import CardBlueprint from '../CardBlueprint'
import { Coordinates, PdfElement, PdfElementRenderer, mmToPt } from './PdfElements'

export type InfoParams = {
  info: CardInfo
  region: Region
  cardBlueprint: CardBlueprint
}

type PdfDetailElementProps = {
  width: number
  fontSize: number
  infoToDetails: (info: InfoParams) => string
} & Coordinates

type PdfDetailElementRendererProps = {
  page: PDFPage
  font: PDFFont
  info: CardInfo
  region: Region
  cardBlueprint: CardBlueprint
}

export type PdfDetailElementRenderer = PdfElementRenderer<PdfDetailElementRendererProps>

const PdfDetailElement: PdfElement<PdfDetailElementProps, PdfDetailElementRendererProps> =
  ({ width, x, y, fontSize, infoToDetails }) =>
  ({ page, font, info, region, cardBlueprint }) => {
    const text = infoToDetails({ info, region, cardBlueprint })

    const lineHeight = mmToPt(5)

    page.drawText(text, {
      font,
      x: mmToPt(x),
      y: page.getSize().height - mmToPt(y) - lineHeight,
      maxWidth: mmToPt(width),
      wordBreaks: text.split('').filter(c => !'\n\f\r\u000B'.includes(c)), // Split on every character
      lineHeight,
      size: fontSize,
    })
  }

export default PdfDetailElement
