import { PDFDocument, PDFFont, PDFPage, PDFString } from '@cantoo/pdf-lib'

import { Coordinates, mmToPt } from './pdfElements'

export type PdfLinkAreaProps = {
  size: number
} & Coordinates

type PdfLinkAreaRendererProps = {
  doc: PDFDocument
  page: PDFPage
  font: PDFFont
  url: string
}

const pdfLinkArea = (
  linkAreaElementProps: PdfLinkAreaProps,
  linkAreaRenderProps: PdfLinkAreaRendererProps,
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
export default pdfLinkArea
