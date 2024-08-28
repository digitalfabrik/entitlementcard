package app.ehrenamtskarte.backend.stores

import app.ehrenamtskarte.backend.stores.utils.clean
import org.junit.Test
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
}
