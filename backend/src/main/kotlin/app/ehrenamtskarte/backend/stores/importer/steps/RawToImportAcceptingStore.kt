package app.ehrenamtskarte.backend.stores.importer.steps

import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.types.ImportAcceptingStore
import app.ehrenamtskarte.backend.stores.importer.types.LbeAcceptingStore
import org.slf4j.Logger

class RawToImportAcceptingStore(private val logger: Logger) : PipelineStep<List<LbeAcceptingStore>, List<ImportAcceptingStore>>() {

    override fun execute(input: List<LbeAcceptingStore>) = input.map {
        try {
            val store = ImportAcceptingStore(
                it.name,
                it.street,
                it.postalCode,
                it.location,
                "de",
                it.longitude!!.replace(",", ".").toDouble(),
                it.latitude!!.replace(",", ".").toDouble(),
                it.email,
                it.telephone,
                it.homepage,
                it.discount,
                it.category!!.toInt()
            )
            if (it.houseNumber != null && it.houseNumber!!.isNotBlank())
                store.copy(street = store.street?.trim() + " Nr. " + it.houseNumber)
            else
                store
        } catch (e: NumberFormatException) {
            logger.info("Number format exception occurred while mapping $it from raw", e)
            null
        } catch (e: Exception) {
            logger.info("Unknown exception occurred while mapping $it from raw", e)
            null
        }
    }.filterNotNull()

}
