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
                it.name!!.trim(),
                COUNTRY_CODE,
                it.location!!.trim(),
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
                it.discount.clean()
            ).sanitizeStreetHouseNumber()
        } catch (e: Exception) {
            logger.info("Exception occurred while mapping $it", e)
            null
        }
    }

    private fun houseNumberRegex(): Regex {
        // House number prefix, e.g. "B[200]", "H[7]" (mostly in industrial parks)
        @Language("RegExp")
        val houseNumberPrefix = """[A-Z]?"""

        // House number range, e.g. "[5] - 7", "[2]+3" or "[11] und 12"
        @Language("RegExp")
        val houseNumberRange = """\s?(-|\+|u\.|und|/)\s?[0-9]+"""

        // Additional house number info, e.g. "[13] 1/2" or "[1] 3/4" (must not be followed by another digit)
        @Language("RegExp")
        val houseNumberAdditionFraction = """\s?[0-9]/[0-9]"""

        // Additional house number info, e.g. "[12]a" or "[2] B" (must be followed by a whitespace or the end of the string)
        @Language("RegExp")
        val houseNumberAdditionLetter = """\s?[a-zA-Z]($|\s)"""

        return """$houseNumberPrefix[0-9]+(($houseNumberRange)|($houseNumberAdditionFraction)|($houseNumberAdditionLetter))?""".toRegex()
    }

    private fun AcceptingStore.sanitizeStreetHouseNumber(): AcceptingStore {
        val isStreetPolluted = street?.find { it.isDigit() } != null
        val isHouseNumberPolluted = houseNumber != null && !houseNumberRegex.matches(houseNumber)

        if (isStreetPolluted || isHouseNumberPolluted) {
            val address = listOfNotNull(street, houseNumber).joinToString(" ").replace(Regex("""\s{2,}"""), " ")
            val match = houseNumberRegex.find(address)

            if (match == null) {
                // No house number, the whole address is the street
                logger.logChange(this, "Address", "$street|$houseNumber", address)
                return copy(street = address, houseNumber = null)
            }

            val cleanStreet = address.substring(0, match.range.first).trim()
            val cleanHouseNumber = match.value.toLowerCase().trim()

            // Residue that is neither the street nor the house number, e.g. "im Hauptbahnhof", "Ecke Theaterstraße"
            val cleanAdditionalInformation = if (match.range.last < address.length - 1) {
                val additionalInformation =
                    address.substring(match.range.last + 1).trim { !it.isLetterOrDigit() }.clean()
                if (additionalInformation != cleanHouseNumber) additionalInformation else null
            } else null

            val newAddress = listOfNotNull(cleanStreet, cleanHouseNumber, cleanAdditionalInformation).joinToString("|")
            logger.logChange(this, "Address", "$street|$houseNumber", newAddress)

            return copy(
                street = cleanStreet,
                houseNumber = cleanHouseNumber,
                additionalAddressInformation = cleanAdditionalInformation
            )
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

    private fun String?.clean(): String? {
        return this?.replaceNa()?.trim()
    }

    private fun LbeAcceptingStore.cleanPostalCode(): String? {
        val oldPostalCode = postalCode ?: return null
        val fiveDigitRegex = """[0-9]{5}""".toRegex()

        val newPostalCode = fiveDigitRegex.find(oldPostalCode)?.value
        if (newPostalCode != oldPostalCode.clean()) {
            logger.logChange("$name, $location", "Postal code", oldPostalCode, newPostalCode)
        }
        return newPostalCode
    }

}
