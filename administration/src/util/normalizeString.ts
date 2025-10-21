// eslint-disable-next-line no-control-regex
const nonAsciiRegex = /[^\x00-\x7F]/g

const normalizeToAscii = (str: string): string => str.normalize('NFKD').replace(nonAsciiRegex, '')

export const normalizeWhitespace = (str: string): string => str.trim().replace(/\s+/g, ' ')

const normalizeString = (str: string): string => normalizeWhitespace(normalizeToAscii(str).toLowerCase())

const disallowedCharsInNameRegex = /[^a-zA-Z0-9]/g
export const normalizeName = (name: string): string => normalizeString(name).replace(disallowedCharsInNameRegex, '')

export default normalizeString
