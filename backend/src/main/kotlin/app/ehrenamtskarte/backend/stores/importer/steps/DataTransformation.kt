package app.ehrenamtskarte.backend.stores.importer.steps

import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.types.ImportAcceptingStore
import org.slf4j.Logger

class DataTransformation(private val logger: Logger) : PipelineStep<List<ImportAcceptingStore>, List<ImportAcceptingStore>>() {



    override fun execute(input: List<ImportAcceptingStore>) = input.map { store ->
        val pc = if (store.postalCode != null) findPostalCode(store.postalCode) else ""
        store.copy(
            categoryId = if (store.categoryId == 99) 9 else store.categoryId,
            postalCode = pc
        )
    }

    companion object {

        private const val POSTAL_CODE_LENGTH = 5

        fun findPostalCode(pc: String): String {
            // loop over a sliding window of length 5 and check whether it contains an appropriate postal code
            (0 until pc.length - POSTAL_CODE_LENGTH).forEach {
                val pivot = pc.substring(it, it + POSTAL_CODE_LENGTH)
                if (pivot.toIntOrNull() != null)
                    return pivot
            }
            return ""
        }

    }

}
