package app.ehrenamtskarte.backend.stores.importer.steps

import app.ehrenamtskarte.backend.common.COUNTRY_CODE
import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.logChange
import app.ehrenamtskarte.backend.stores.importer.replaceNa
import app.ehrenamtskarte.backend.stores.importer.types.AcceptingStore
import app.ehrenamtskarte.backend.stores.importer.types.LbeAcceptingStore
import org.intellij.lang.annotations.Language
import org.slf4j.Logger

const val MISCELLANEOUS_CATEGORY = 9
const val ALTERNATIVE_MISCELLANEOUS_CATEGORY = 99

class Map(private val logger: Logger) : PipelineStep<List<LbeAcceptingStore>, List<AcceptingStore>>() {
    private val houseNumberRegex = houseNumberRegex()

    override fun execute(input: List<LbeAcceptingStore>) = input.mapNotNull {
        try {
            AcceptingStore(
                it.name.clean()!!,
                COUNTRY_CODE,
                it.location.clean()!!,
                it.cleanPostalCode(),
                it.street.clean(),
                it.houseNumber.clean(),
                null,
                it.longitude.safeToDouble(),
                it.latitude.safeToDouble(),
                categoryId(it.category!!),
                it.email.clean(),
                it.telephone.clean(),
                it.homepage.clean(),
                it.discount.clean(false)
            ).sanitizeStreetHouseNumber()
        } catch (e: Exception) {
            logger.info("Exception occurred while mapping $it", e)
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
            val cleanHouseNumber = houseNumberMatch.value.toLowerCase().trim()

            // Residue that is neither the street nor the house number, e.g. "im Hauptbahnhof", "Ecke Theaterstraße"
            val residue = if (houseNumberMatch.range.last < address.length - 1) {
                val res = address.substring(houseNumberMatch.range.last + 1).trim { !it.isLetterOrDigit() }.clean()
                if (res != cleanHouseNumber) res else null
            } else null

            val newAddress = listOfNotNull(cleanStreet, cleanHouseNumber, residue).joinToString("|")
            logger.logChange("$name, $location", "Address", "$street|$houseNumber", newAddress)

            return copy(street = cleanStreet, houseNumber = cleanHouseNumber, additionalAddressInformation = residue)
        }
        return this
    }

    private fun String?.safeToDouble(): Double? {
        return this?.clean()?.replace(",", ".")?.toDouble()
    }

    private fun categoryId(category: String): Int {
        val int = category.toInt()
        return if (int == ALTERNATIVE_MISCELLANEOUS_CATEGORY) MISCELLANEOUS_CATEGORY else int
    }

    private fun String?.clean(removeSubsequentWhitespaces: Boolean = true): String? {
        val trimmed = this?.replaceNa()?.trim()
        if (removeSubsequentWhitespaces) {
            return trimmed?.replace(Regex("""\s{2,}"""), " ")
        }
        return trimmed
    }

    private fun LbeAcceptingStore.cleanPostalCode(): String? {
        val oldPostalCode = postalCode ?: return null
        val fiveDigitRegex = Regex("""[0-9]{5}""")

        val newPostalCode = fiveDigitRegex.find(oldPostalCode)?.value
        if (newPostalCode != oldPostalCode.clean()) {
            logger.logChange("$name, $location", "Postal code", oldPostalCode, newPostalCode)
        }
        return newPostalCode
    }

}
