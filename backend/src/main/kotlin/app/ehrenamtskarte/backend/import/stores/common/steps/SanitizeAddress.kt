package app.ehrenamtskarte.backend.import.stores.common.steps

import app.ehrenamtskarte.backend.import.STREET_EXCLUDE_PATTERN
import app.ehrenamtskarte.backend.import.stores.ImportConfig
import app.ehrenamtskarte.backend.import.stores.PipelineStep
import app.ehrenamtskarte.backend.import.stores.common.types.AcceptingStore
import app.ehrenamtskarte.backend.import.stores.logChange
import org.intellij.lang.annotations.Language
import org.slf4j.Logger
import java.util.Locale

/**
 * Sanitizes the addresses of the [AcceptingStore].
 * Postal codes are mapped to either the first five digits (german postcode format) or null.
 * Street and house numbers are correctly separated.
 */
class SanitizeAddress(
    config: ImportConfig,
    private val logger: Logger,
) : PipelineStep<List<AcceptingStore>, List<AcceptingStore>>(config) {
    private val houseNumberRegex = houseNumberRegex()
    private val postalCodeRegex = Regex("""[0-9]{5}""")

    override fun execute(input: List<AcceptingStore>) =
        input.mapNotNull {
            try {
                if (it.street?.contains(STREET_EXCLUDE_PATTERN) == true) return@mapNotNull it

                it.sanitizePostalCode().sanitizeStreetHouseNumber()
            } catch (e: Exception) {
                logger.error("Exception occurred while sanitizing the address of $it", e)
                null
            }
        }

    private fun houseNumberRegex(): Regex {
        // E.g. "B[200]", "H[7]" (mostly in industrial parks)
        @Language("RegExp")
        val prefix = """[A-Z]?"""

        // E.g. "[5] - 7", "[2]+3" or "[11] und 12"
        @Language("RegExp")
        val range = """\s?(-|\+|u\.|und|/)\s?[0-9]+"""

        // E.g. "[13] 1/2" or "[1] 3/4"
        @Language("RegExp")
        val fraction = """\s?[0-9]/[0-9]"""

        // E.g. "[12]a" or "[2] B" (must be followed by a whitespace or the end of the string)
        @Language("RegExp")
        val letter = """\s?[a-zA-Z]($|\s)"""

        return Regex("""$prefix[0-9]+(($range)|($fraction)|($letter))?""")
    }

    /**
     * Correctly separates the street and house number properties.
     * Excess information is moved to the [AcceptingStore.additionalAddressInformation] property.
     * Examples: 'Untere'|'Zell' -> 'Untere Zell'|null, 'Am Römerbad 17'|'a' -> 'Am Römerbad'|'17 a',
     *   'Rückermainstr. 2; 1.'|'OG' -> 'Rückermainstr.'|'2'|'1. OG'
     */
    private fun AcceptingStore.sanitizeStreetHouseNumber(): AcceptingStore {
        val isStreetPolluted = street?.find { it.isDigit() } != null
        val isHouseNumberPolluted = houseNumber != null && !houseNumberRegex.matches(houseNumber)

        if (isStreetPolluted || isHouseNumberPolluted) {
            val address = listOfNotNull(street, houseNumber).joinToString(" ")
            val houseNumberMatch = houseNumberRegex.find(address)

            if (houseNumberMatch == null) {
                // No house number, the whole address is the street
                logger.logChange("$name, $location", "Address", "$street|$houseNumber", address)
                return copy(street = address, houseNumber = null)
            }

            val cleanStreet = address.substring(0, houseNumberMatch.range.first).trim()
            val cleanHouseNumber = houseNumberMatch.value.lowercase(Locale.GERMAN).trim()

            // Residue that is neither the street nor the house number, e.g. "im Hauptbahnhof", "Ecke Theaterstraße"
            val residue = if (houseNumberMatch.range.last < address.length - 1) {
                val res = address.substring(houseNumberMatch.range.last + 1).trim { !it.isLetterOrDigit() }
                if (res != cleanHouseNumber && res.isNotEmpty()) res else null
            } else {
                null
            }

            val newAddress = listOfNotNull(cleanStreet, cleanHouseNumber, residue)
                .filterNot { it.isEmpty() }
                .joinToString("|")
            logger.logChange("$name, $location", "Address", "$street|$houseNumber", newAddress)

            return copy(
                street = cleanStreet,
                houseNumber = cleanHouseNumber,
                additionalAddressInformation = residue,
            )
        }
        return this
    }

    /**
     * Maps the postal code to the first five digits or null.
     * Examples: '86150' -> '86150', 'Augsburg 86161 Rathausplatz' -> '86161', 'A-1234' -> null
     */
    private fun AcceptingStore.sanitizePostalCode(): AcceptingStore {
        val oldPostalCode = postalCode ?: return this

        val newPostalCode = postalCodeRegex.find(oldPostalCode)?.value
        if (newPostalCode != oldPostalCode) {
            logger.logChange("$name, $location", "Postal code", oldPostalCode, newPostalCode)
        }
        return copy(postalCode = newPostalCode)
    }
}
