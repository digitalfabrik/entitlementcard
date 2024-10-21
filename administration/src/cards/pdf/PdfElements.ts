export type Coordinates = {
  x: number
  y: number
}

export const mmToPt = (mm: number): number => (mm / 25.4) * 72

export type PdfElement<
  ConfigOptions extends Record<string, unknown>,
  DynamicOptions extends Record<string, unknown>
> = (options: ConfigOptions, dynamicOptions: DynamicOptions) => void
