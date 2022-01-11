package app.ehrenamtskarte.backend.stores.importer.steps

import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.types.AcceptingStore
import org.apache.commons.text.StringEscapeUtils
import org.slf4j.Logger

class Encode(private val logger: Logger) : PipelineStep<List<AcceptingStore>, List<AcceptingStore>>() {

    override fun execute(input: List<AcceptingStore>) = input.mapNotNull {
        try {
            return@mapNotNull it.copy(
                name = it.name.decodeSpecialCharacters(),
                discount = it.discount?.decodeSpecialCharacters()
            )
        } catch (e: Exception) {
            logger.info("Exception while encoding $it for database import", e)
        }
        null
    }

    private fun String.decodeSpecialCharacters(): String {
        // We often get a double encoded string, i.e. &amp;amp;
        return StringEscapeUtils.unescapeHtml4(
            StringEscapeUtils.unescapeHtml4(
                this
            )
        ).replace("<br/>", "\n")
    }

}
