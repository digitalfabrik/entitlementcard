package app.ehrenamtskarte.backend.verification

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith

internal class CanonicalJsonTest {

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
        val input = listOf<Any?>(mapOf("b" to 123, 1 to "string"))
        val expected = """[{"1":"string","b":123}]"""
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
        val input = mapOf("hello" to "world")
        val expected = """{"hello":"world"}"""
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
        val input = object { val unknown = "unknown" }

        assertFailsWith<Error> { CanonicalJson.serializeToString(input) }
    }

    @Test
    fun objectWithNumberKey() {
        val input = mapOf(42 to "foo")
        val expected = """{"42":"foo"}"""
        val actual = CanonicalJson.serializeToString(input)

        assertEquals(expected, actual)
    }
}
