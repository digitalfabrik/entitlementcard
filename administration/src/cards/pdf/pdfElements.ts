export type Coordinates = {
  x: number
  y: number
}

export const mmToPt = (mm: number): number => (mm / 25.4) * 72
