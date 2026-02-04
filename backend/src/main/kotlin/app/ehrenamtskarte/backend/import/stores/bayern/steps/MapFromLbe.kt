package app.ehrenamtskarte.backend.import.stores.bayern.steps

import app.ehrenamtskarte.backend.db.entities.LanguageCode
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidInputException
import app.ehrenamtskarte.backend.import.ALTERNATIVE_MISCELLANEOUS_CATEGORY_ID
import app.ehrenamtskarte.backend.import.COUNTRY_CODE
import app.ehrenamtskarte.backend.import.MISCELLANEOUS_CATEGORY_ID
import app.ehrenamtskarte.backend.import.stores.ImportConfig
import app.ehrenamtskarte.backend.import.stores.PipelineStep
import app.ehrenamtskarte.backend.import.stores.bayern.types.LbeAcceptingStore
import app.ehrenamtskarte.backend.import.stores.common.types.AcceptingStore
import app.ehrenamtskarte.backend.import.stores.replaceNa
import org.apache.commons.text.StringEscapeUtils
import org.slf4j.Logger

/**
 * Maps [LbeAcceptingStore] to [AcceptingStore].
 * Properties are cleaned, decoded and converted to the correct types.
 */
class MapFromLbe(
    config: ImportConfig,
    private val logger: Logger,
) : PipelineStep<List<LbeAcceptingStore>, List<AcceptingStore>>(config) {
    override fun execute(input: List<LbeAcceptingStore>) =
        input.mapNotNull {
            try {
                val discounts = it.discount.clean(false)?.let { discount ->
                    mapOf(LanguageCode.DE to discount)
                } ?: emptyMap()

                AcceptingStore(
                    it.name.clean() ?: throw InvalidInputException("Name is required"),
                    COUNTRY_CODE,
                    it.location.clean() ?: throw InvalidInputException("Location is required"),
                    it.postalCode.clean(),
                    it.street.clean(),
                    it.houseNumber.clean(),
                    null,
                    it.longitude.safeToDouble(),
                    it.latitude.safeToDouble(),
                    categoryId(it.category!!),
                    it.email.clean(),
                    it.telephone.clean(),
                    it.homepage.clean(),
                    discounts,
                    it.freinetId.clean()?.toInt(),
                    it.districtName.clean(),
                )
            } catch (e: Exception) {
                logger.error("Exception occurred while mapping $it", e)
                null
            }
        }

    private fun String?.safeToDouble(): Double? = this?.clean()?.replace(",", ".")?.toDouble()

    private fun categoryId(category: String): Int {
        val int = category.toInt()
        return if (int == ALTERNATIVE_MISCELLANEOUS_CATEGORY_ID) MISCELLANEOUS_CATEGORY_ID else int
    }

    private fun String.decodeSpecialCharacters(): String {
        // We often get a double encoded string, i.e. &amp;amp;
        return StringEscapeUtils
            .unescapeHtml4(StringEscapeUtils.unescapeHtml4(this))
            .replace("<br/>", "\n")
    }

    private fun String?.clean(removeSubsequentWhitespaces: Boolean = true): String? {
        val trimmed = this?.replaceNa()?.trim()?.decodeSpecialCharacters()
        if (removeSubsequentWhitespaces) {
            return trimmed?.replace(Regex("""\s{2,}"""), " ")
        }
        return trimmed
    }
}
