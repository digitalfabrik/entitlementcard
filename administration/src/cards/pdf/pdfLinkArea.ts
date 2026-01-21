import { PDFDocument, PDFFont, PDFPage, PDFString } from '@cantoo/pdf-lib'

import { Coordinates, mmToPt, PdfElement } from './pdfElements'

export type PdfLinkAreaProps = {
  size: number
} & Coordinates

type PdfLinkAreaRendererProps = {
  doc: PDFDocument
  page: PDFPage
  font: PDFFont
  url: string
}

const pdfLinkArea: PdfElement<PdfLinkAreaProps, PdfLinkAreaRendererProps> = (
  { size, x, y },
  { doc, page, url },
) => {
  const deepLinkAreaSize = mmToPt(size)
  const deepLinkAreaX = mmToPt(x)
  const deepLinkAreaY = page.getSize().height - deepLinkAreaSize - mmToPt(y)
  const link = doc.context.register(
    doc.context.obj({
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
      A: { Type: 'Action', S: 'URI', URI: PDFString.of(url) },
    }),
  )

  page.node.addAnnot(link)
}
export default pdfLinkArea
