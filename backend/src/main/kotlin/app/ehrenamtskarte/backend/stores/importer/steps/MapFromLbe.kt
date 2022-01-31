package app.ehrenamtskarte.backend.stores.importer.steps

import app.ehrenamtskarte.backend.common.COUNTRY_CODE
import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.replaceNa
import app.ehrenamtskarte.backend.stores.importer.types.AcceptingStore
import app.ehrenamtskarte.backend.stores.importer.types.LbeAcceptingStore
import org.slf4j.Logger

const val MISCELLANEOUS_CATEGORY = 9
const val ALTERNATIVE_MISCELLANEOUS_CATEGORY = 99

class MapFromLbe(private val logger: Logger) : PipelineStep<List<LbeAcceptingStore>, List<AcceptingStore>>() {
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
                it.discount.clean(false)
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
        return if (int == ALTERNATIVE_MISCELLANEOUS_CATEGORY) MISCELLANEOUS_CATEGORY else int
    }

    private fun String?.clean(removeSubsequentWhitespaces: Boolean = true): String? {
        val trimmed = this?.replaceNa()?.trim()
        if (removeSubsequentWhitespaces) {
            return trimmed?.replace(Regex("""\s{2,}"""), " ")
        }
        return trimmed
    }
}
