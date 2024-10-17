import { PDFFont, PDFForm, PDFPage, PDFTextField, grayscale } from 'pdf-lib'

import { CardInfo } from '../../generated/card_pb'
import { Region } from '../../generated/graphql'
import CardBlueprint from '../CardBlueprint'
import { Coordinates, PdfElement, mmToPt } from './PdfElements'

export type InfoParams = {
  info: CardInfo
  cardBlueprint: CardBlueprint
  cardInfoHash: string
  region?: Region
}

export type PdfFormElementProps = {
  infoToFormFields: (form: PDFForm, pageIdx: number, info: InfoParams) => PDFTextField[]
  fontSize: number
  width: number
} & Coordinates

type PdfFormElementRendererProps = {
  page: PDFPage
  form: PDFForm
  font: PDFFont
  info: CardInfo
  cardBlueprint: CardBlueprint
  cardInfoHash: string
  region?: Region
}

const pdfFormElements: PdfElement<PdfFormElementProps, PdfFormElementRendererProps> = (
  { infoToFormFields, fontSize, width, x, y },
  { page, form, font, info, region, cardBlueprint, cardInfoHash }
) => {
  const pageIdx = page.doc.getPageCount()
  const formFields = infoToFormFields(form, pageIdx, { info, region, cardBlueprint, cardInfoHash })
  const lineHeight = font.heightAtSize(fontSize) + 6

  formFields.forEach((formField, index) => {
    formField.addToPage(page, {
      x: mmToPt(x),
      y: page.getSize().height - mmToPt(y) - lineHeight * index,
      borderColor: grayscale(1),
      height: lineHeight,
      width: mmToPt(width),
      font,
    })
    formField.enableCombing()
    formField.setFontSize(fontSize)
  })

  // form.flatten()
}

export default pdfFormElements
