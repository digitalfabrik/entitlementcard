package app.ehrenamtskarte.backend.stores.importer.steps

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.stores.ALTERNATIVE_MISCELLANEOUS_CATEGORY_ID
import app.ehrenamtskarte.backend.stores.COUNTRY_CODE
import app.ehrenamtskarte.backend.stores.MISCELLANEOUS_CATEGORY_ID
import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.replaceNa
import app.ehrenamtskarte.backend.stores.importer.types.AcceptingStore
import app.ehrenamtskarte.backend.stores.importer.types.LbeAcceptingStore
import org.apache.commons.text.StringEscapeUtils
import org.slf4j.Logger

/**
 * Maps [LbeAcceptingStore] to [AcceptingStore].
 * Properties are cleaned, decoded and converted to the correct types.
 */
class MapFromLbe(config: BackendConfiguration, private val logger: Logger) : PipelineStep<List<LbeAcceptingStore>, List<AcceptingStore>>(config) {

    override fun execute(input: List<LbeAcceptingStore>) = input.mapNotNull {
        try {
            AcceptingStore(
                it.name.clean()!!,
                COUNTRY_CODE,
                it.location.clean()!!,
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
                it.discount.clean(false),
                it.freinetId.clean()?.toInt(),
                it.districtName.clean()
            )
        } catch (e: Exception) {
            logger.info("Exception occurred while mapping $it", e)
            null
        }
    }

    private fun String?.safeToDouble(): Double? {
        return this?.clean()?.replace(",", ".")?.toDouble()
    }

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
