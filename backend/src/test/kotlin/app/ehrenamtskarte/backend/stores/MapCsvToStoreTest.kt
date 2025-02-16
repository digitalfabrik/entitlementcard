package app.ehrenamtskarte.backend.stores

import app.ehrenamtskarte.backend.stores.importer.common.types.AcceptingStore
import app.ehrenamtskarte.backend.stores.utils.mapCsvToStore
import app.ehrenamtskarte.backend.stores.webservice.schema.types.CSVAcceptingStore
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals

internal class MapCsvToStoreTest {

    @Test
    fun isMappingCsvToStoreCorrect() {
        val csvStore = CSVAcceptingStore(
            "Test store",
            "Teststr.",
            "10",
            "90408",
            "Nürnberg",
            12.700,
            11.0765467,
            "0911/123456",
            "info@test.de",
            "https://www.test.de/kontakt/",
            "20% Ermäßigung für Erwachsene",
            "20% discount for adults",
            17
        )
        val mappedStore = mapCsvToStore(csvStore)
        val expectedMappedStore = AcceptingStore("Test store", "de", "Nürnberg", "90408", "Teststr.", "10", "", 11.0765467, 12.7, 17, "info@test.de", "0911/123456", "https://www.test.de/kontakt/", "20% Ermäßigung für Erwachsene\n\n20% discount for adults", null, null, "Teststr. 10")
        assertEquals(mappedStore, expectedMappedStore)
    }

    @Test
    fun isMappingCsvToStoreCorrectWithEmptyValues() {
        val csvStore = CSVAcceptingStore(
            "Test store",
            "Teststr.",
            "10",
            "90408",
            "Nürnberg",
            12.700,
            11.0765467,
            "",
            "",
            "",
            "",
            "",
            17
        )
        val mappedStore = mapCsvToStore(csvStore)
        val expectedMappedStore = AcceptingStore("Test store", "de", "Nürnberg", "90408", "Teststr.", "10", "", 11.0765467, 12.7, 17, null, null, null, null, null, null, "Teststr. 10")
        assertEquals(mappedStore, expectedMappedStore)
    }
}
