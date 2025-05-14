package app.ehrenamtskarte.backend.stores.importer.bayern.steps

import app.ehrenamtskarte.backend.stores.importer.ImportConfig
import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.bayern.types.FilteredStore
import app.ehrenamtskarte.backend.stores.importer.common.types.AcceptingStore
import org.apache.commons.csv.CSVFormat
import org.slf4j.LoggerFactory
import java.io.BufferedWriter
import java.nio.file.Files
import java.nio.file.Paths

class WriteCsv(config: ImportConfig, private val filteredStores: MutableList<FilteredStore>) :
    PipelineStep<List<AcceptingStore>, List<AcceptingStore>>(config) {
    override fun execute(input: List<AcceptingStore>): List<AcceptingStore> {
        val filteredOutputPath = config.findProject().filteredStoresOutput
        if (!filteredOutputPath.isNullOrBlank()) {
            writeCsvWithFilteredStores(filteredOutputPath)
        }
        return input
    }

    private fun writeCsvWithFilteredStores(outputPath: String) {
        val logger = LoggerFactory.getLogger(WriteCsv::class.java)
        try {
            val writer: BufferedWriter =
                Files.newBufferedWriter(Paths.get(outputPath))

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

            val printer = CSVFormat.RFC4180.builder()
                .setHeader(*columns.map { it.name }.toTypedArray())
                .build()
                .print(writer)
            filteredStores.forEach { record ->
                printer.printRecord(*(columns.map { it.fromRecord(record) }.toTypedArray()))
            }
            printer.flush()
        } catch (e: Exception) {
            logger.info("Fehler beim Schreiben der CSV:", e)
        }
    }
}
