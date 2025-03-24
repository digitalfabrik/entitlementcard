package app.ehrenamtskarte.backend.stores.importer.nuernberg.steps

import app.ehrenamtskarte.backend.stores.importer.ImportConfig
import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.webservice.schema.types.CSVAcceptingStore
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVParser
import org.slf4j.Logger
import java.io.InputStream
import java.io.InputStreamReader
import java.net.URL

/**
 * Downloads the CSV File.
 * Writes CSV data into list
 */
class DownloadCsv(config: ImportConfig, private val logger: Logger) :
    PipelineStep<Unit, List<CSVAcceptingStore>>(config) {
    override fun execute(input: Unit): List<CSVAcceptingStore> {
        try {
            val inputCSV = InputStreamReader(getCSVInputStream(), Charsets.UTF_8)
            val parser = CSVFormat.RFC4180.builder()
                .setHeader()
                .setSkipHeaderRecord(true)
                .build()
                .parse(inputCSV)

            return getCSVAcceptingStores(parser)
        } catch (e: Exception) {
            logger.error("Unknown exception while downloading data from csv", e)
            throw e
        }
    }

    private fun getCSVAcceptingStores(parser: CSVParser): List<CSVAcceptingStore> {
        val stores: MutableList<CSVAcceptingStore> = arrayListOf()
        parser.records.forEach { record ->
            val name = record.get("Name")
            if (name.isBlank()) {
                throw IllegalArgumentException("CSV record " + record.recordNumber + " has an empty name.")
            }

            val (discountDE, discountEN) =
                if (parser.headerMap.containsKey("Rabatt")) {
                    // Legacy format used until April 2024. Can be removed in future releases.
                    Pair(record.get("Rabatt"), null)
                } else {
                    Pair(record.get("RabattDE"), record.get("RabattEN"))
                }

            stores.add(
                CSVAcceptingStore(
                    name = name,
                    street = record.get("Straße"),
                    houseNumber = record.get("Hausnummer"),
                    postalCode = record.get("PLZ"),
                    location = record.get("Ort"),
                    latitude = record.get("Breitengrad"),
                    longitude = record.get("Längengrad"),
                    telephone = record.get("Telefon"),
                    email = record.get("Email"),
                    homepage = record.get("Website"),
                    discountDE = discountDE,
                    discountEN = discountEN,
                    categoryId = record.get("Kategorie"),
                ),
            )
        }
        return stores
    }

    /**
     * This function decides if a local csv file will be used or a file from entitlementcard server depending if csvWriter is enabled.
     * csvWriter is used to create a local csv output file with coordinates of the stores which will be uploaded to the server.
     */
    private fun getCSVInputStream(): InputStream {
        if (config.backendConfig.csvWriter.enabled) {
            return ClassLoader.getSystemResourceAsStream("import/Akzeptanzpartner-daten.csv")!!
        }
        val url = URL(config.findProject().importUrl)
        return url.openConnection().getInputStream()
    }
}
