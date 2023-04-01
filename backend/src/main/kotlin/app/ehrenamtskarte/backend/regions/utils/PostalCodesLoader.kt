package app.ehrenamtskarte.backend.regions.utils

import org.apache.commons.csv.CSVFormat
import java.io.InputStream

object PostalCodesLoader {
    fun loadRegionIdentifierByPostalCodeMap(): Map<String, String> {
        try {
            val csvInput: InputStream = ClassLoader.getSystemResourceAsStream("import/plz_ort_bayern.csv")!!
            val records = CSVFormat.RFC4180.parse(csvInput.reader())
            val postalCodes: MutableMap<String, String> = mutableMapOf()
            records.forEachIndexed { index, record ->
                val headline = index == 0
                if (record[1].isNotEmpty() && !headline) {
                    postalCodes[record[1]] = '0' + record[0].substring(0, 4)
                }
            }
            return postalCodes
        } catch (e: Exception) {
            throw Exception("Couldn't read CSV", e)
        }
    }
}
