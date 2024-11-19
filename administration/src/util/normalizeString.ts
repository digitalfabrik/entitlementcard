// eslint-disable-next-line no-control-regex
const nonAsciiRegex = /[^\x00-\x7F]/g

const normalizeToAscii = (str: string): string => str.normalize('NFKD').replace(nonAsciiRegex, '')

const normalizeString = (str: string): string => normalizeToAscii(str).toLowerCase().trim()

const disallowedCharsInNameRegex = /[^a-zA-Z0-9]/g
export const normalizeName = (name: string): string => normalizeString(name).replace(disallowedCharsInNameRegex, '')

export default normalizeString
