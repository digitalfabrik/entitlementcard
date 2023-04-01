package app.ehrenamtskarte.backend.stores.importer.nuernberg.steps

import app.ehrenamtskarte.backend.stores.importer.ImportConfig
import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.nuernberg.types.CSVAcceptingStore
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVRecord
import org.slf4j.Logger
import java.io.InputStreamReader
import java.net.URL
import java.net.URLConnection

/**
 * Downloads the CSV File.
 * Writes CSV data into list
 */

class DownloadCsv(config: ImportConfig, private val logger: Logger) :
    PipelineStep<Unit, List<CSVAcceptingStore>>(config) {

    override fun execute(input: Unit): List<CSVAcceptingStore> {
        try {
            val url = URL(config.findProject().importUrl)
            val urlConn: URLConnection = url.openConnection()
            val inputCSV = InputStreamReader(
                urlConn.getInputStream(),
                Charsets.UTF_8
            )
            val records: Iterable<CSVRecord> = CSVFormat.RFC4180.parse(inputCSV)

            return getCSVAcceptingStores(records)
        } catch (e: Exception) {
            logger.info("Unknown exception while downloading data from csv", e)
            throw e
        }
    }

    private fun getCSVAcceptingStores(records: Iterable<CSVRecord>): List<CSVAcceptingStore> {
        val stores: MutableList<CSVAcceptingStore> = arrayListOf()
        records.forEachIndexed { index, record ->
            val headline = index == 0
            // at least a name is required
            if (record[1].isNotEmpty() && !headline) {
                stores.add(
                    CSVAcceptingStore(
                        record[0],
                        record[1],
                        record[2],
                        record[3],
                        record[4],
                        record[5],
                        record[6],
                        record[7],
                        record[8],
                        record[9],
                        record[10],
                        record[11],
                        record[12]
                    )
                )
            }
        }
        return stores
    }
}
