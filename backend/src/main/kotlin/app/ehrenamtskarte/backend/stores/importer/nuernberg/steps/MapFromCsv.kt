package app.ehrenamtskarte.backend.stores.importer.nuernberg.steps

import app.ehrenamtskarte.backend.stores.COUNTRY_CODE
import app.ehrenamtskarte.backend.stores.importer.ImportConfig
import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.common.types.AcceptingStore
import app.ehrenamtskarte.backend.stores.importer.nuernberg.types.CSVAcceptingStore
import app.ehrenamtskarte.backend.stores.importer.replaceNa
import org.slf4j.Logger

/**
 * Maps [CSVAcceptingStore] to [AcceptingStore].
 * Properties are cleaned, decoded and converted to the correct types.
 */
class MapFromCsv(config: ImportConfig, private val logger: Logger) :
    PipelineStep<List<CSVAcceptingStore>, List<AcceptingStore>>(config) {
    private val categoryMapping =
        mapOf(
            "0" to "10",
            "1" to "11",
            "2" to "12",
            "3" to "13",
            "4" to "14",
            "5" to "15",
            "6" to "16",
            "7" to "17",
            "8" to "18",
            "9" to "9",
        ).withDefault { "9" }

    override fun execute(input: List<CSVAcceptingStore>) = input.mapNotNull {
        val longitude = if (it.longitude?.isNotEmpty()!!) {
            it.longitude!!.toDouble()
        } else null

        val latitude = if (it.latitude?.isNotEmpty()!!) {
            it.latitude!!.toDouble()
        } else null

        try {
            AcceptingStore(
                it.name.clean()!!,
                COUNTRY_CODE,
                it.location.clean()!!,
                it.postalCode.clean()!!,
                it.street.clean()!!,
                it.houseNumber.clean()!!,
                null,
                longitude,
                latitude,
                categoryMapping.getValue(it.categoryId!!).toInt(),
                it.email.clean(),
                it.telephone.clean(),
                it.homepage.clean(),
                it.discount.clean(false),
                null,
                null
            )
        } catch (e: Exception) {
            logger.info("Exception occurred while mapping $it", e)
            null
        }
    }

    private fun String?.clean(removeSubsequentWhitespaces: Boolean = true): String? {
        val trimmed = this?.replaceNa()?.trim()
        if (removeSubsequentWhitespaces) {
            return trimmed?.replace(Regex("""\s{2,}"""), " ")
        }
        return trimmed
    }
}
