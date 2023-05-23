export type Coordinates = {
  x: number
  y: number
}

export function mmToPt(mm: number) {
  return (mm / 25.4) * 72
}

export type PdfElementRenderer<T extends Record<string, any>> = (info: T) => void
export type PdfElement<P extends Record<string, any>, T extends Record<string, any>> = (
  options: P
) => PdfElementRenderer<T>
