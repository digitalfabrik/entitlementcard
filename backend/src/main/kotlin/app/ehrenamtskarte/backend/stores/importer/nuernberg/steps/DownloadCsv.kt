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
            // generateMissingStoresCSV(rows)

            return getCSVAcceptingStores(rows)
        } catch (e: Exception) {
            logger.info("Unknown exception while downloading data from csv", e)
            throw e
        }
    }

    // TODO remove fkt when csv is cleaned
//    private fun generateMissingStoresCSV(rows: List<List<String>>) {
//        val iterator = rows.listIterator(0)
//        csvWriter().open("akzeptanzstellen_fehlende_daten.csv") {
//            while (iterator.hasNext()) {
//                val row = iterator.next()
//                val isFirstRow = iterator.nextIndex() == 1
//                if (row[2].isEmpty() || row[3].isEmpty() || row[4].isEmpty() || row[5].isEmpty() || row[11].isEmpty() || row[12].isEmpty() || isFirstRow) {
//                    writeRow(row)
//                }
//            }
//        }
//    }

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
