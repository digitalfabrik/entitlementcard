package app.ehrenamtskarte.backend.regions.utils

import org.apache.commons.csv.CSVFormat
import java.io.InputStream

object PostalCodesLoader {
    fun loadRegionIdentifierByPostalCodeMap(): List<Pair<String, String>> {
        try {
            val csvInput: InputStream = ClassLoader.getSystemResourceAsStream("import/plz_ort_bayern.csv")!!
            val records = CSVFormat.RFC4180.parse(csvInput.reader())
            val postalCodes = mutableListOf<Pair<String, String>>()
            records.forEachIndexed { index, record ->
                val headline = index == 0
                if (record[1].isNotEmpty() && !headline) {
                    postalCodes.add(record[1] to '0' + record[0].substring(0, 4))
                }
            }
            // Since we shorten region codes we have to remove duplicate pairs
            return postalCodes.toSet().toList()
        } catch (e: Exception) {
            throw Exception("Couldn't read CSV", e)
        }
    }
}
