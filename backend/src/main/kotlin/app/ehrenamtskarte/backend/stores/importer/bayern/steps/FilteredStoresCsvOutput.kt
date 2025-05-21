package app.ehrenamtskarte.backend.stores.importer.bayern.steps

import app.ehrenamtskarte.backend.stores.importer.ImportConfig
import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.bayern.types.FilteredStore
import app.ehrenamtskarte.backend.stores.importer.common.types.AcceptingStore
import org.apache.commons.csv.CSVFormat
import org.slf4j.LoggerFactory
import java.nio.file.Files
import java.nio.file.Paths

class FilteredStoresCsvOutput(config: ImportConfig, private val filteredStores: MutableList<FilteredStore>) :
    PipelineStep<List<AcceptingStore>, List<AcceptingStore>>(config) {
    override fun execute(input: List<AcceptingStore>): List<AcceptingStore> {
        val filteredOutputPath = config.project.filteredStoresOutput
        if (!filteredOutputPath.isNullOrBlank()) {
            writeCsvWithFilteredStores(filteredOutputPath)
        }
        return input
    }

    private fun writeCsvWithFilteredStores(outputPath: String) {
        val logger = LoggerFactory.getLogger(FilteredStoresCsvOutput::class.java)

        data class Col(
            val name: String,
            val fromRecord: (store: FilteredStore) -> String?,
        )

        val columns = listOf(
            Col("Name") { it.name },
            Col("Straße") { it.street },
            Col("Hausnummer") { it.houseNumber },
            Col("PLZ") { it.postalCode },
            Col("Ort") { it.location },
            Col("Grund") { it.reason },
        )

        try {
            Files.newBufferedWriter(Paths.get(outputPath)).use { writer ->
                CSVFormat.RFC4180.builder()
                    .setHeader(*columns.map { it.name }.toTypedArray())
                    .get()
                    .print(writer).use { printer ->
                        filteredStores.forEach { record ->
                            printer.printRecord(columns.map { it.fromRecord(record) })
                        }
                    }
            }
        } catch (e: Exception) {
            logger.info("Fehler beim Schreiben der CSV:", e)
        }
    }
}
