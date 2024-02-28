import { PDFDocument, PDFFont, PDFPage, PDFRef, PDFString, rgb } from 'pdf-lib'

import { Coordinates, PdfElement, mmToPt } from './PdfElements'

export type PdfLinkElementProps = {
  fontSize: number
  name: string
} & Coordinates

type PdfLinkElementRendererProps = {
  doc: PDFDocument
  page: PDFPage
  font: PDFFont
  url: string
}

const createPageLinkAnnotation = (
  url: string,
  x: number,
  y: number,
  width: number,
  height: number,
  doc: PDFDocument
): PDFRef => {
  return doc.context.register(
    doc.context.obj({
      Type: 'Annot',
      Subtype: 'Link',
      /* Bounds of the link on the page */
      Rect: [
        x, // lower left x coord
        y, // lower left y coord
        x + width, // upper right x coord
        y + height, // upper right y coord
      ],
      // override default border
      Border: [0, 0, 0],
      // /* C: [2, 2, 1], */
      // URI Action
      A: { Type: 'Action', S: 'URI', URI: PDFString.of(url) },
    })
  )
}
const pdfLinkElement: PdfElement<PdfLinkElementProps, PdfLinkElementRendererProps> = (
  { fontSize, x, y, name },
  { doc, page, font, url }
) => {
  const color = rgb(15 / 255, 82 / 255, 123 / 255)
  const width = font.widthOfTextAtSize(name, fontSize)
  const spacing = 1
  const linkXCoordinate = mmToPt(x)
  const linkYCoordinate = page.getSize().height - mmToPt(y)

  page.drawText(name, { font, size: fontSize, x: linkXCoordinate, y: linkYCoordinate, color })
  page.drawLine({
    color,
    start: { x: linkXCoordinate, y: linkYCoordinate - spacing },
    end: { x: linkXCoordinate + width, y: linkYCoordinate - spacing },
    thickness: 0.5,
  })
  const link = createPageLinkAnnotation(url, linkXCoordinate, linkYCoordinate, width, fontSize, doc)
  page.node.addAnnot(link)
}
export default pdfLinkElement
