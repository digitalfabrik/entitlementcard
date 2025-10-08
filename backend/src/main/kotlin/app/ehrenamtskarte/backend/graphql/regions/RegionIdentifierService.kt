package app.ehrenamtskarte.backend.graphql.regions

import org.apache.commons.csv.CSVFormat
import org.springframework.stereotype.Service
import java.io.InputStream

/**
 * Service responsible for loading and providing access to the mapping of
 * postal codes to region identifiers used in the EAK Bayern project.
 *
 * The mapping is read once from the CSV file `import/plz_ort_bayern.csv`
 * on first access and then cached for the lifetime of the application.
 */
@Service
class RegionIdentifierService {
    val regionIdentifierByPostalCode: List<Pair<String, String>> by lazy {
        loadRegionIdentifierByPostalCodeMap()
    }

    private fun loadRegionIdentifierByPostalCodeMap(): List<Pair<String, String>> {
        try {
            val csvInput: InputStream = ClassLoader
                .getSystemResourceAsStream("import/plz_ort_bayern.csv")
                ?: throw IllegalStateException("CSV file not found in resources: import/plz_ort_bayern.csv")

            val records = CSVFormat.RFC4180.parse(csvInput.reader())
            val postalCodes = mutableListOf<Pair<String, String>>()

            records.forEachIndexed { index, record ->
                val headline = index == 0
                if (record[1].isNotEmpty() && !headline) {
                    // Take the first 4 digits of record[0], prefix with '0'
                    postalCodes.add(record[1] to '0' + record[0].substring(0, 4))
                }
            }

            // Since region codes are shortened we remove duplicates
            return postalCodes.toSet().toList()
        } catch (e: Exception) {
            throw RuntimeException("Couldn't read CSV for region identifiers", e)
        }
    }
}
