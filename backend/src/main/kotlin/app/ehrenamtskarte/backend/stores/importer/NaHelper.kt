package app.ehrenamtskarte.backend.stores.importer

private val unspecifiedNoteRegex = Regex("""^\s*(n\.?\s*A\.?|)\s*$""")

fun matchesNa(needle: String) = unspecifiedNoteRegex.matches(needle)
