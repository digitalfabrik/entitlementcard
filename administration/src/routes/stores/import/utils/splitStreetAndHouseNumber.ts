export const splitStreetAndHouseNumber = (
  streetWithHouseNumber: string | null | undefined,
): { street: string; houseNumber: string } => {
  const trimmed = streetWithHouseNumber?.trim()

  if (!trimmed) {
    return { street: '', houseNumber: '' }
  }

  // - Optional prefix: [A-Z]? (e.g. "B200", "H7")
  // - Number: [0-9]+
  // - Range: (-|\+|u\.|und|/) with optional spaces
  // - Fraction: [0-9]/[0-9]
  // - Letter: [a-z] with optional space (followed by end or space)
  const houseNumberRegex =
    /\s+([A-Z]?\d+(?:\s?[a-z])?(?:(?:\s?[-+/]\s?|\s+u\.\s+|\s+und\s+)\d+(?:\s?[a-z])?)*(?:\s?\d\/\d)?(?=\s|$))/i
  const match = trimmed.match(houseNumberRegex)

  if (match) {
    const street = trimmed.substring(0, match.index).trim()
    const houseNumber = match[1].trim() // Nur äußere Leerzeichen entfernen

    if (street.length > 0) {
      return { street, houseNumber }
    }
  }

  console.warn(`Could not split address: "${trimmed}"`)
  return { street: trimmed, houseNumber: '' }
}
