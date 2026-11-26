import sharp from 'sharp'

export type MaskRegion = { left: number; top: number; width: number; height: number }

const MASK_COLOR = { r: 204, g: 214, b: 34 } // #CCD622

export async function maskRegions(buffer: Buffer, regions: MaskRegion[]): Promise<Buffer> {
  const { r, g, b } = MASK_COLOR
  const fill = Buffer.from([r, g, b])

  return sharp(buffer)
    .composite(
      regions.map(({ left, top, width, height }) => ({
        input: Buffer.alloc(width * height * 3, fill),
        raw: { width, height, channels: 3 as const },
        left,
        top,
      })),
    )
    .png()
    .toBuffer()
}
