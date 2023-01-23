package app.ehrenamtskarte.backend.stores.importer.nuernberg.utils

import app.ehrenamtskarte.backend.stores.importer.common.types.AcceptingStore
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVPrinter
import java.io.BufferedWriter
import java.nio.file.Files
import java.nio.file.Paths

/**
 * This fkt provides missing geoinformation for stores of the provided input file and outputs it in a separate csv file
 */

fun writeCsvWithGeoInformation(input: List<AcceptingStore>) {
    val writer: BufferedWriter =
        Files.newBufferedWriter(Paths.get("src/main/resources/import/nuernberg-akzeptanzstellen_geoinfo.csv"))

    val printer = CSVPrinter(
        writer,
        CSVFormat.RFC4180.withHeader(
            "ID",
            "Name",
            "Straße",
            "Hausnummer",
            "PLZ",
            "Ort",
            "Breitengrad",
            "Längengrad",
            "Telefon",
            "Email",
            "Website",
            "Rabatt",
            "Kategorie"
        )
    )

    input.forEach { record ->
        printer.printRecord(
            "",
            record.name,
            record.street,
            record.houseNumber,
            record.postalCode,
            record.location,
            record.latitude,
            record.longitude,
            record.telephone,
            record.email,
            record.website,
            record.discount,
            record.categoryId
        )
    }
    printer.flush()
}
