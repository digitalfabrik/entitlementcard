import { PDFDocument, PDFFont, PDFPage, PDFRef, PDFString } from '@cantoo/pdf-lib'

import { Coordinates, PdfElement, mmToPt } from './PdfElements'

export type PdfLinkAreaProps = {
  size: number
} & Coordinates

type PdfLinkAreaRendererProps = {
  doc: PDFDocument
  page: PDFPage
  font: PDFFont
  url: string
}

const createPageLinkAnnotation = (
  url: string,
  x: number,
  y: number,
  size: number,
  doc: PDFDocument,
): PDFRef =>
  doc.context.register(
    doc.context.obj({
      Type: 'Annot',
      Subtype: 'Link',
      /* Bounds of the link on the page */
      Rect: [
        x, // lower left x coord
        y, // lower left y coord
        x + size, // upper right x coord
        y + size, // upper right y coord
      ],
      // override default border
      Border: [0, 0, 0],
      // /* C: [2, 2, 1], */
      // URI Action
      A: { Type: 'Action', S: 'URI', URI: PDFString.of(url) },
    }),
  )
const pdfLinkArea: PdfElement<PdfLinkAreaProps, PdfLinkAreaRendererProps> = (
  { size, x, y },
  { doc, page, url },
) => {
  const deepLinkAreaSize = mmToPt(size)
  const deepLinkAreaX = mmToPt(x)
  const deepLinkAreaY = page.getSize().height - deepLinkAreaSize - mmToPt(y)

  const link = createPageLinkAnnotation(url, deepLinkAreaX, deepLinkAreaY, deepLinkAreaSize, doc)
  page.node.addAnnot(link)
}
export default pdfLinkArea
