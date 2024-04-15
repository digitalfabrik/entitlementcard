package app.ehrenamtskarte.backend.stores.importer.nuernberg.utils

import app.ehrenamtskarte.backend.stores.importer.common.types.AcceptingStore
import app.ehrenamtskarte.backend.stores.importer.nuernberg.types.CSVAcceptingStore
import org.apache.commons.csv.CSVFormat
import java.io.BufferedWriter
import java.nio.file.Files
import java.nio.file.Paths

/**
 * Writes a CSV file in the same format as the input CSV to the resources folder.
 * This is used to complement the input file with missing geoinformation.
 */
fun writeCsvWithGeoInformation(csvStores: List<CSVAcceptingStore>, geocodedStores: List<AcceptingStore>) {
    val writer: BufferedWriter =
        Files.newBufferedWriter(Paths.get("src/main/resources/import/nuernberg-akzeptanzstellen_geoinfo.csv"))

    if (csvStores.size != geocodedStores.size) {
        throw IllegalArgumentException("Cannot write CSV, as some stores have been filtered out.")
    }

    data class Col(
        val name: String,
        val fromRecord: (store: Pair<CSVAcceptingStore, AcceptingStore>) -> String?
    )

    val columns = listOf(
        Col("ID") { null },
        Col("Name") { it.second.name },
        Col("Straße") { it.second.street },
        Col("Hausnummer") { it.second.houseNumber },
        Col("PLZ") { it.second.postalCode },
        Col("Ort") { it.second.location },
        Col("Breitengrad") { it.second.latitude.toString() },
        Col("Längengrad") { it.second.longitude.toString() },
        Col("Telefon") { it.second.telephone },
        Col("Email") { it.second.email },
        Col("Website") { it.second.website },
        Col("RabattDE") { it.first.discountDE },
        Col("RabattEN") { it.first.discountEN },
        Col("Kategorie") { it.second.categoryId.toString() }
    )

    val printer = CSVFormat.RFC4180.builder().setHeader(*columns.map { it.name }.toTypedArray()).build().print(writer)
    csvStores.zip(geocodedStores).forEach { record ->
        printer.printRecord(*(columns.map { it.fromRecord(record) }.toTypedArray()))
    }
    printer.flush()
}
