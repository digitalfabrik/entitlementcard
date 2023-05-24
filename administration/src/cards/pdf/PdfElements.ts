export type Coordinates = {
  x: number
  y: number
}

export function mmToPt(mm: number) {
  return (mm / 25.4) * 72
}

export type PdfElement<ConfigOptions extends Record<string, any>, DynamicOptions extends Record<string, any>> = (
  options: ConfigOptions,
  dynamicOptions: DynamicOptions
) => void
