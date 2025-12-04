// eslint-disable-next-line no-control-regex
const nonAsciiRegex = /[^\x00-\x7F]/g

const normalizeToAscii = (str: string): string => str.normalize('NFKD').replace(nonAsciiRegex, '')

export const normalizeWhitespace = (str: string): string => str.trim().replace(/\s+/g, ' ')

const normalizeString = (str: string): string => normalizeWhitespace(normalizeToAscii(str).toLowerCase())

const disallowedCharsInNameRegex = /[^a-zA-Z0-9]/g
export const normalizeName = (name: string): string => normalizeString(name).replace(disallowedCharsInNameRegex, '')

export default normalizeString

export const trimStringFields = <T extends Record<string, string | unknown>>(obj: T): T =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
  ) as T
