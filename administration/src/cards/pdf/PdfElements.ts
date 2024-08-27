export type Coordinates = {
  x: number
  y: number
}

export function mmToPt(mm: number): number {
  return (mm / 25.4) * 72
}

export type PdfElement<
  ConfigOptions extends Record<string, unknown>,
  DynamicOptions extends Record<string, unknown>
> = (options: ConfigOptions, dynamicOptions: DynamicOptions) => void
