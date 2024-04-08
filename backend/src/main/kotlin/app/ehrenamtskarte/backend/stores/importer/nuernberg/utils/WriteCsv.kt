package app.ehrenamtskarte.backend.stores.importer.nuernberg.utils

import app.ehrenamtskarte.backend.stores.importer.common.types.AcceptingStore
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVPrinter
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
            "RabattDE",
            "RabattEN",
            "Kategorie"
        )
    )

    input.forEach { record ->
        val discounts = splitDiscount(record.discount)
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
            discounts.discountDE,
            discounts.discountEN,
            record.categoryId
        )
    }
    printer.flush()
}
