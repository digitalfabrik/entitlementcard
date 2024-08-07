import normalizeStrings from 'normalize-strings'

const normalizeString = (str: string): string => normalizeStrings(str).toLowerCase().trim()
export const normalizeName = (name: string) => normalizeString(name).replaceAll(/[^a-zA-Z0-9]/g, '')

export default normalizeString
