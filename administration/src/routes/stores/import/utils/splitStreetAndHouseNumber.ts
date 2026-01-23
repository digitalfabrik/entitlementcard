export const splitStreetAndHouseNumber = (
  streetWithHouseNumber: string | null | undefined,
): { street: string; houseNumber: string } => {
  if (streetWithHouseNumber === undefined || streetWithHouseNumber === null) {
    return { street: '', houseNumber: '' }
  }

  const houseNumberRegex = /\s*(\d+\s*[a-z]?(?:\s*[-/]\s*\d+\s*[a-z]?)?)$/i
  const match = streetWithHouseNumber.match(houseNumberRegex)

  if (match) {
    const street = streetWithHouseNumber.substring(0, match.index).trim()
    const houseNumber = match[0].trim()

    if (street.length > 0) {
      return { street, houseNumber }
    }
  }

  console.warn(`Could not split address: "${streetWithHouseNumber}"`)
  return { street: streetWithHouseNumber, houseNumber: '' }
}
