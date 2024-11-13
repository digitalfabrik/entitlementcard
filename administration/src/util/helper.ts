export const isDevMode = (): boolean => window.location.hostname === 'localhost'
export const isStagingMode = (): boolean => !!window.location.hostname.match(/staging./)

export const updateArrayItem = <T>(array: T[], updatedItem: T, index: number): T[] => {
  if (index >= array.length || index < 0) {
    throw new RangeError(`Index ${index} is out of range`)
  }
  return [...array.slice(0, index), updatedItem, ...array.slice(index + 1)]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never

const multipleSpacePattern = /\s\s+/g
export const removeMultipleSpaces = (value: string): string => value.replace(multipleSpacePattern, ' ')
