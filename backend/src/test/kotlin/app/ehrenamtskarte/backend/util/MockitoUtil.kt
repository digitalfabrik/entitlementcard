package app.ehrenamtskarte.backend.util

import org.mockito.Mockito

/**
 * Mockito.any() returns null, causing NPEs with Kotlin non-null parameters.
 * This helper bypasses the issue.
 */
@Suppress("UNCHECKED_CAST")
fun <T> any(): T {
    Mockito.any<T>()
    return null as T
}

/**
 * Mockito.eq() may return null, causing NPEs with Kotlin non-null parameters.
 * This helper bypasses the issue.
 */
@Suppress("UNCHECKED_CAST")
fun <T> eq(value: T): T {
    Mockito.eq(value)
    return null as T
}
