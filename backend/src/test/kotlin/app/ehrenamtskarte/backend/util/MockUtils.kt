package app.ehrenamtskarte.backend.util

import io.mockk.every
import io.mockk.spyk
import kotlin.reflect.KProperty1
import kotlin.reflect.full.memberProperties
import kotlin.reflect.jvm.isAccessible

object MockUtils {

    @Suppress("UNCHECKED_CAST")
    fun <T : Any> deepSpy(obj: T): T {
        val spyObj = spyk<Any>(obj)
        obj::class.memberProperties
            .filterIsInstance<KProperty1<T, *>>()
            .forEach { prop ->
                prop.isAccessible = true
                val value = prop.get(obj)
                if (value != null && value::class.isData) {
                    every { prop.get(spyObj as T) } returns deepSpy(value)
                }
            }
        return spyObj as T
    }
}
