package app.ehrenamtskarte.backend.stores.importer.nuernberg.steps

import app.ehrenamtskarte.backend.stores.importer.ImportConfig
import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.nuernberg.types.CSVAcceptingStore
import com.github.doyaaaaaken.kotlincsv.dsl.csvReader
import org.slf4j.Logger
import java.io.BufferedReader
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
                urlConn.getInputStream()
            )
            val reader = BufferedReader(inputCSV)
            val rows: List<List<String>> = csvReader { skipEmptyLine = true }.readAll(reader.readText())

            return getCSVAcceptingStores(rows)
        } catch (e: Exception) {
            logger.info("Unknown exception while downloading data from csv", e)
            throw e
        }
    }

    private fun getCSVAcceptingStores(rows: List<List<String>>): List<CSVAcceptingStore> {
        val iterator = rows.listIterator(1)
        val stores: MutableList<CSVAcceptingStore> = arrayListOf()
        while (iterator.hasNext()) {
            val row = iterator.next()
            // at least a name is required
            if (row[1].isNotEmpty()) {
                stores.add(
                    CSVAcceptingStore(
                        row[0],
                        row[1],
                        row[2],
                        row[3],
                        row[4],
                        row[5],
                        row[6],
                        row[7],
                        row[8],
                        row[9],
                        row[10],
                        row[11],
                        row[12]
                    )
                )
            }
        }
        return stores
    }
}
