package app.ehrenamtskarte.backend.stores.importer.steps

import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.logRemoveDuplicates
import app.ehrenamtskarte.backend.stores.importer.types.AcceptingStore
import org.slf4j.Logger

class FilterDuplicates(private val logger: Logger) : PipelineStep<List<AcceptingStore>, List<AcceptingStore>>() {

    override fun execute(input: List<AcceptingStore>): List<AcceptingStore> {
        // Group by name + postal code + street to detect duplicates
        val groups = input.groupBy {
            (it.name + it.postalCode + it.street).toLowerCase().filter { char -> char.isLetterOrDigit() }
        }

        return groups.values.map { it.deduplicate() }
    }

    private fun List<AcceptingStore>.deduplicate(): AcceptingStore {
        if (size == 1) return first() // No duplicates, nothing to do

        // Use the last as that is perhaps the last updated/created one
        val store = last()
        val houseNumber = mapNotNull { it.houseNumber }.lastOrNull()
        val website = mapNotNull { it.website }.lastOrNull()
        val email = mapNotNull { it.email }.lastOrNull()
        val telephone = mapNotNull { it.telephone }.lastOrNull()
        val additionalAddressInformation = mapNotNull { it.additionalAddressInformation }.lastOrNull()

        // The coordinates are often just cut after some digits so use the one with the best precision
        val longitude = mapNotNull { it.longitude }.maxBy { it.toString().length }
        val latitude = mapNotNull { it.latitude }.maxBy { it.toString().length }

        // Combine all descriptions because we have no way of knowing which is the correct one
        val discounts = mapNotNull { it.discount }.toSet().joinToString("\n")

        logger.logRemoveDuplicates(store, size - 1)

        return AcceptingStore(
            store.name,
            store.countryCode,
            store.location,
            store.postalCode,
            store.street,
            houseNumber,
            additionalAddressInformation,
            longitude,
            latitude,
            store.categoryId,
            email,
            telephone,
            website,
            discounts
        )
    }

}
