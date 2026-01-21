import { grayscale, PDFFont, PDFForm, PDFPage, PDFTextField } from '@cantoo/pdf-lib'

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

export type PdfFormElementProps = {
  infoToFormFields: (form: PDFForm, pageIdx: number, info: InfoParams) => PDFTextField[]
  fontSize: number
  width: number
} & Coordinates

const pdfFormElements = (
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

export default pdfFormElements
