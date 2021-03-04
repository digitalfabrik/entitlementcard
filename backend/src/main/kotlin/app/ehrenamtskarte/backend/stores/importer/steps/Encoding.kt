package app.ehrenamtskarte.backend.stores.importer.steps

import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.types.ImportAcceptingStore
import org.apache.commons.text.StringEscapeUtils
import org.slf4j.Logger

class Encoding(val logger: Logger) : PipelineStep<List<ImportAcceptingStore>, List<ImportAcceptingStore>> {

    override fun execute(input: List<ImportAcceptingStore>) = input.map {
        try {
            ImportAcceptingStore(
                it.name?.decodeSpecialCharacters()?.sanitizeForDb(),
                it.street?.sanitizeForDb(),
                it.postalCode?.sanitizeForDb(),
                it.location?.sanitizeForDb(),
                it.countryCode?.sanitizeForDb(),
                it.longitude,
                it.latitude,
                it.email?.sanitizeForDb(),
                it.telephone?.sanitizeForDb(),
                it.website?.sanitizeForDb(),
                it.discount?.decodeSpecialCharacters()?.sanitizeForDb(),
                it.categoryId
            )
        } catch (e: Exception) {
            logger.info("Exception while encoding $it for database import:\n$e.message")
            null
        }
    }.filterNotNull()

    private val unspecifiedNoteRegex = Regex("""^\s*(n\.?\s*A\.?|)\s*$""")

    private fun String.decodeSpecialCharacters(): String {
        // We often get a double encoded string, i.e. &amp;amp;
        return StringEscapeUtils.unescapeHtml4(
            StringEscapeUtils.unescapeHtml4(
                this
            )
        ).replace("<br/>", "\n")
    }

    /**
     * Replaces notes for unspecified entries with `null` and trims the String otherwise.
     *
     * Such a note consists of the letters "nA" (in that order), potentially with dots like "n.A." and/or stuffed with
     * whitespace (e.g. " n A. "), or of whitespace only.
     *
     * @return `null` if `text` is a "unspecified note", trimmed `text` otherwise
     * @see String.trim
     */
    private fun String.sanitizeForDb(): String? {
        return if (unspecifiedNoteRegex.matches(this)) null else this.trim()
    }

}
