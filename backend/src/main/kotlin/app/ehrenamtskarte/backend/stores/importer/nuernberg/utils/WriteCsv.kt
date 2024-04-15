package app.ehrenamtskarte.backend.stores.importer.nuernberg.utils

import app.ehrenamtskarte.backend.stores.importer.common.types.AcceptingStore
import org.apache.commons.csv.CSVFormat
import java.io.BufferedWriter
import java.nio.file.Files
import java.nio.file.Paths

/**
 * Writes a CSV file in the same format as the input CSV to the resources folder.
 * This is used to complement the input file with missing geoinformation.
 */
fun writeCsvWithGeoInformation(input: List<AcceptingStore>) {
    val writer: BufferedWriter =
        Files.newBufferedWriter(Paths.get("src/main/resources/import/nuernberg-akzeptanzstellen_geoinfo.csv"))

    data class Col(
        val name: String,
        val fromRecord: (store: AcceptingStore) -> String?
    )

    val columns = listOf(
        Col("ID") { null },
        Col("Name") { it.name },
        Col("Straße") { it.street },
        Col("Hausnummer") { it.houseNumber },
        Col("PLZ") { it.postalCode },
        Col("Ort") { it.location },
        Col("Breitengrad") { it.latitude.toString() },
        Col("Längengrad") { it.longitude.toString() },
        Col("Telefon") { it.telephone },
        Col("Email") { it.email },
        Col("Website") { it.website },
        Col("RabattDE") { it.discount },
        Col("RabattEN") { null },
        Col("Kategorie") { it.categoryId.toString() }
    )

    val printer = CSVFormat.RFC4180.builder().setHeader(*columns.map { it.name }.toTypedArray()).build().print(writer)
    input.forEach { record ->
        printer.printRecord(*(columns.map { it.fromRecord(record) }.toTypedArray()))
    }
    printer.flush()
}
