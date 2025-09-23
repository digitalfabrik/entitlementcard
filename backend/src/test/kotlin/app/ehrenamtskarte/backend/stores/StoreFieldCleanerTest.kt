package app.ehrenamtskarte.backend.stores

import app.ehrenamtskarte.backend.graphql.stores.clean
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals

internal class StoreFieldCleanerTest {
    @Test
    fun trimStringProperlyButKeepsSubsequentWhitespaces() {
        val testString = " TestString mit   vielen   Leerzeichen "
        assertEquals(testString.clean(false), "TestString mit   vielen   Leerzeichen")
    }

    @Test
    fun trimStringAndSubsequentWhitespacesProperly() {
        val testString = " TestString mit   vielen   Leerzeichen "
        assertEquals(testString.clean(), "TestString mit vielen Leerzeichen")
    }

    @Test
    fun trimEmptryStringShouldReturnNull() {
        val testString = ""
        assertEquals(testString.clean(), null)
    }
}
