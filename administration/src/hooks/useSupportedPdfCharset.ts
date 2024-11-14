import { useEffect, useState } from 'react'
import { PDFDocument, StandardFonts } from 'pdf-lib'

const getSupportedSet = async (): Promise<Set<number>> => {
  const doc = await PDFDocument.create()
  const helveticaFont = await doc.embedFont(StandardFonts.Helvetica)
  const supportedCodePoints = helveticaFont.getCharacterSet();
  return new Set(supportedCodePoints);
}

const useSupportedPdfCharset = (): Set<number> | undefined => {
  const [charset, setCharset] = useState<Set<number>>()

  useEffect(() => {
    getSupportedSet().then(setCharset)
  }, [])

  console.log(charset)
  return charset
}

export default useSupportedPdfCharset
