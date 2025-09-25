package app.ehrenamtskarte.backend.stores

import app.ehrenamtskarte.backend.graphql.stores.mapCsvToStore
import app.ehrenamtskarte.backend.graphql.stores.types.CSVAcceptingStore
import app.ehrenamtskarte.backend.import.stores.common.types.AcceptingStore
import org.junit.jupiter.api.DynamicTest
import org.junit.jupiter.api.TestFactory
import kotlin.test.assertEquals

internal class MapCsvToStoreTest {
    private val mapCsvToStoreTestData = listOf(
        CSVAcceptingStore(
            " Test  store with trailing  spaces ",
            " Teststr. ",
            " 10 ",
            " 90408  ",
            " Lauf an  der  Pegnitz ",
            12.700,
            11.0765467,
            " 0911/123456 ",
            " info@test.de ",
            " https://www.test.de/kontakt/ ",
            "20% Ermäßigung für Erwachsene",
            "20% discount for adults",
            17,
        ) to AcceptingStore(
            "Test store with trailing spaces",
            "de",
            "Lauf an der Pegnitz",
            "90408",
            "Teststr.",
            "10",
            "",
            11.0765467,
            12.7,
            17,
            "info@test.de",
            "0911/123456",
            "https://www.test.de/kontakt/",
            "20% Ermäßigung für Erwachsene\n\n20% discount for adults",
            null,
            null,
            "Teststr. 10",
        ),
        CSVAcceptingStore(
            "Test store with empty optional fields",
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
            17,
        ) to AcceptingStore(
            "Test store with empty optional fields",
            "de",
            "Nürnberg",
            "90408",
            "Teststr.",
            "10",
            "",
            11.0765467,
            12.7,
            17,
            null,
            null,
            null,
            null,
            null,
            null,
            "Teststr. 10",
        ),
        CSVAcceptingStore(
            "Test store with german-only description",
            "Teststr.",
            "10",
            "90408",
            "Nürnberg",
            12.700,
            11.0765467,
            "",
            "",
            "",
            "20% Ermäßigung für Erwachsene",
            "",
            17,
        ) to AcceptingStore(
            "Test store with german-only description",
            "de",
            "Nürnberg",
            "90408",
            "Teststr.",
            "10",
            "",
            11.0765467,
            12.7,
            17,
            null,
            null,
            null,
            "20% Ermäßigung für Erwachsene",
            null,
            null,
            "Teststr. 10",
        ),
    )

    @TestFactory
    fun testCsvToStoreMapping() =
        mapCsvToStoreTestData.map { (csvStore, expectedStore) ->
            DynamicTest.dynamicTest("should clean the data and convert csv input to the accepting store object") {
                val mappedStore = mapCsvToStore(csvStore)
                assertEquals(expectedStore, mappedStore)
            }
        }
}
