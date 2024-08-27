package app.ehrenamtskarte.backend.stores.utils

/** Returns null if string can't be trimmed f.e. empty string
 * Removes subsequent whitespaces
 * */
fun String?.clean(removeSubsequentWhitespaces: Boolean = true): String? {
    val trimmed = this?.trim()
    if (removeSubsequentWhitespaces) {
        if (trimmed != null) {
            return trimmed.replace(Regex("""\s{2,}"""), " ")
        }
    }
    return trimmed
}
