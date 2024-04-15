package app.ehrenamtskarte.backend.stores.importer.nuernberg.steps

import app.ehrenamtskarte.backend.stores.importer.ImportConfig
import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.common.types.AcceptingStore
import app.ehrenamtskarte.backend.stores.importer.nuernberg.types.CSVAcceptingStore
import app.ehrenamtskarte.backend.stores.importer.nuernberg.utils.writeCsvWithGeoInformation
import kotlinx.coroutines.runBlocking
import org.slf4j.Logger

class FilterGeoData(config: ImportConfig, private val logger: Logger) :
    PipelineStep<Pair<List<CSVAcceptingStore>, List<AcceptingStore>>, List<AcceptingStore>>(config) {
    override fun execute(input: Pair<List<CSVAcceptingStore>, List<AcceptingStore>>): List<AcceptingStore> = runBlocking {
        val csvStores = input.first
        val acceptingStores = input.second

        // writes csv file including geodata. Can be used if import file is lacking geoinformation.
        if (config.backendConfig.csvWriter.enabled) {
            if (config.backendConfig.geocoding.enabled) {
                writeCsvWithGeoInformation(csvStores, acceptingStores)
            } else {
                throw Exception("Geocoding has to be enabled to get geoinformation.")
            }
        }

        // TODO can be removed when geodata was added to the csv
        acceptingStores.filter {
            if (it.longitude == null || it.latitude == null) {
                logger.error("'${it.name} (${it.streetWithHouseNumber}, ${it.postalCode} ${it.location})' couldn't get proper geoInfo")
                return@filter false
            }
            true
        }
    }
}
