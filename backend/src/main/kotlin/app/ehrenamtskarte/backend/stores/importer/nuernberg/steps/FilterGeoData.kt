package app.ehrenamtskarte.backend.stores.importer.nuernberg.steps

import app.ehrenamtskarte.backend.stores.importer.ImportConfig
import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.common.types.AcceptingStore
import app.ehrenamtskarte.backend.stores.importer.nuernberg.utils.writeCsvWithGeoInformation
import kotlinx.coroutines.runBlocking
import org.slf4j.Logger

class FilterGeoData(config: ImportConfig, private val logger: Logger) :
    PipelineStep<List<AcceptingStore>, List<AcceptingStore>>(config) {
    override fun execute(input: List<AcceptingStore>): List<AcceptingStore> = runBlocking {
        // writes csv file including geodata. Can be used if import file is lacking geoinformation. Geocoding has to be enabled in the config to get missing geoinformation!
        if (config.backendConfig.csvWriter.enabled) {
            writeCsvWithGeoInformation(input)
        }

        // TODO can be removed when geodata was added to the csv
        input.filter {
            if (it.longitude == null || it.latitude == null) {
                logger.info("'${it.name} (${it.streetWithHouseNumber}, ${it.postalCode} ${it.location})' couldn't get proper geoInfo")
                return@filter false
            }
            true
        }
    }
}
