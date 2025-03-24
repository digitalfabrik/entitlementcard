package app.ehrenamtskarte.backend.stores.importer

private val unspecifiedNoteRegex = Regex("""^\s*(n\.?\s*A\.?|)\s*$""")

fun matchesNa(needle: String) = unspecifiedNoteRegex.matches(needle)

/**
 * Replaces notes for unspecified entries with `null`.
 *
 * Such a note consists of the letters "nA" (in that order), potentially with dots like "n.A." and/or stuffed with
 * whitespace (e.g. " n A. "), or of whitespace only.
 *
 * @return `null` if `text` is a "unspecified note", `text` otherwise
 * @see String.trim
 */
fun String.replaceNa(): String? = if (matchesNa(this)) null else this
