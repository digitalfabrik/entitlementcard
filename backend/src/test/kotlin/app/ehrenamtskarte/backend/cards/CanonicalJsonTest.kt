package app.ehrenamtskarte.backend.cards

import Card
import app.ehrenamtskarte.backend.cards.CanonicalJson.Companion.koblenzUserToString
import app.ehrenamtskarte.backend.helper.SampleCards
import app.ehrenamtskarte.backend.helper.koblenzTestUser
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith

internal class CanonicalJsonTest {
    @Test
    fun mapEmptyCardInfo() {
        val cardInfo = Card.CardInfo.newBuilder().build()
        assertEquals(CanonicalJson.messageToMap(cardInfo), emptyMap())
    }

    @Test
    fun mapCardInfoWithFullName() {
        val wildName = "Biene Maja ßäЦЧШܐܳܠܰܦ"
        val cardInfo =
            Card.CardInfo
                .newBuilder()
                .setFullName(wildName)
                .build()
        assertEquals(CanonicalJson.messageToMap(cardInfo), mapOf("1" to wildName))
    }

    @Test
    fun mapCardInfoForBavarianBlueEAK() {
        val cardInfo = SampleCards.BavarianStandard
        assertEquals(
            CanonicalJson.messageToMap(cardInfo),
            mapOf(
                "1" to "Max Mustermann",
                "2" to "14600",
                "3" to
                    mapOf(
                        "1" to mapOf("1" to "16"), // extensionRegion
                        "4" to mapOf("1" to "0"), // extensionBavariaCardType
                    ),
            ),
        )
    }

    @Test
    fun mapCardInfoForBavarianGoldenEAK() {
        val cardInfo = SampleCards.BavarianGold
        assertEquals(
            CanonicalJson.messageToMap(cardInfo),
            mapOf(
                "1" to "Max Mustermann",
                "3" to
                    mapOf(
                        "1" to mapOf("1" to "16"), // extensionRegion
                        "4" to mapOf("1" to "1"), // extensionBavariaCardType
                    ),
            ),
        )
    }

    @Test
    fun mapCardInfoForNuernbergPass() {
        val cardInfo = SampleCards.Nuernberg
        assertEquals(
            CanonicalJson.messageToMap(cardInfo),
            mapOf(
                "1" to "Max Mustermann",
                "2" to "14600",
                "3" to
                    mapOf(
                        "1" to mapOf("1" to "93"), // extensionRegion
                        "2" to mapOf("1" to "-3650"), // extensionBirthday
                        "3" to mapOf("1" to "99999999"), // extensionNuernbergPassId
                    ),
            ),
        )
    }

    @Test
    fun mapCardInfoForNuernbergPassWithStartDay() {
        val cardInfo = SampleCards.NuernbergWithStartDay
        assertEquals(
            CanonicalJson.messageToMap(cardInfo),
            mapOf(
                "1" to "Max Mustermann",
                "2" to "14600",
                "3" to
                    mapOf(
                        "1" to mapOf("1" to "93"), // extensionRegion
                        "2" to mapOf("1" to "-3650"), // extensionBirthday
                        "3" to mapOf("1" to "99999999"), // extensionNuernbergPassId
                        "5" to mapOf("1" to "730"), // extensionStartDay
                    ),
            ),
        )
    }

    @Test
    fun mapUserInfoForKoblenzPass() {
        val expected = koblenzUserToString(koblenzTestUser)
        assertEquals("{\"1\":12213,\"2\":\"123K\"}", expected)
    }

    @Test
    fun emptyArray() {
        val input = emptyList<Any>()
        val expected = "[]"
        val actual = CanonicalJson.serializeToString(input)

        assertEquals(expected, actual)
    }

    @Test
    fun oneElementArray() {
        val input = listOf<Any>(123)
        val expected = "[123]"
        val actual = CanonicalJson.serializeToString(input)

        assertEquals(expected, actual)
    }

    @Test
    fun multiElementArray() {
        val input = listOf<Any?>(123, 456, "hello", true, null)
        val expected = """[123,456,"hello",true,null]"""
        val actual = CanonicalJson.serializeToString(input)

        assertEquals(expected, actual)
    }

    @Test
    fun objectInArray() {
        val input = listOf<Any?>(mapOf("b" to 123, "a" to "string"))
        val expected = """[{"a":"string","b":123}]"""
        val actual = CanonicalJson.serializeToString(input)

        assertEquals(expected, actual)
    }

    @Test
    fun emptyObject() {
        val input = emptyMap<Any, Any>()
        val expected = "{}"
        val actual = CanonicalJson.serializeToString(input)

        assertEquals(expected, actual)
    }

    @Test
    fun objectWithNullValue() {
        val input = mapOf("test" to null)
        val expected = """{"test":null}"""
        val actual = CanonicalJson.serializeToString(input)

        assertEquals(expected, actual)
    }

    @Test
    fun objectWithOneProperty() {
        val input = mapOf("he\\llo" to "world")
        val expected = """{"he\\llo":"world"}"""
        val actual = CanonicalJson.serializeToString(input)

        assertEquals(expected, actual)
    }

    @Test
    fun objectWithMultipleProperties() {
        val input = mapOf("hello" to "world", "number" to 123)
        val expected = """{"hello":"world","number":123}"""
        val actual = CanonicalJson.serializeToString(input)

        assertEquals(expected, actual)
    }

    @Test
    fun nullInput() {
        val input = null
        val expected = "null"
        val actual = CanonicalJson.serializeToString(input)

        assertEquals(expected, actual)
    }

    @Test
    fun unknownType() {
        val input = object {}

        assertFailsWith<Error> { CanonicalJson.serializeToString(input) }
    }

    @Test
    fun sortsAndEscapesProperly() {
        // taken from the rfc: https://www.rfc-editor.org/rfc/rfc8785#section-3.2.3
        val input =
            mapOf(
                "\u20ac" to "Euro Sign",
                "\r" to "Carriage Return",
                "\ufb33" to "Hebrew Letter Dalet With Dagesh",
                "1" to "One",
                "\ud83d\ude00" to "Emoji to Grinning Face",
                "\u0080" to "Control",
                "\u00f6" to "Latin Small Letter O With Diaeresis",
            )
        val expected =
            """{
            "\r":"Carriage Return",
            "1":"One",
            "${"\u0080"}":"Control",
            "${"\u00f6"}":"Latin Small Letter O With Diaeresis",
            "${"\u20ac"}":"Euro Sign",
            "${"\ud83d\ude00"}":"Emoji to Grinning Face",
            "${"\ufb33"}":"Hebrew Letter Dalet With Dagesh"
        }""".split("\n").joinToString(separator = "") {
                it.trim()
            }
        val actual = CanonicalJson.serializeToString(input)

        assertEquals(expected, actual)
    }
}
