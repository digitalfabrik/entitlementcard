package app.ehrenamtskarte.backend.stores.importer.steps

import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.logRemoveDuplicates
import app.ehrenamtskarte.backend.stores.importer.types.AcceptingStore
import org.slf4j.Logger

class FilterDuplicates(private val logger: Logger) : PipelineStep<List<AcceptingStore>, List<AcceptingStore>>() {

    override fun execute(input: List<AcceptingStore>): List<AcceptingStore> {
        val groups = input.groupBy { it.name + it.postalCode + it.street }

        val nonDuplicatedStores = groups.filter { it.value.size == 1 }.values.flatten()
        val duplicatedStores = groups.filter { it.value.size > 1 }.map { it.value }
        val deduplicatedStores = duplicatedStores.map { it.deduplicate() }.flatten()

        return nonDuplicatedStores + deduplicatedStores
    }

    private fun List<AcceptingStore>.deduplicate(): List<AcceptingStore> {
        val houseNumbers = mapNotNull { it.houseNumber }.toSet()

        if (houseNumbers.size > 1) {
            // If there are multiple valid (non-null) house numbers there are probably multiple stores
            // Deduplicate for each separately
            return houseNumbers.map { houseNumber -> filter { it.houseNumber == houseNumber || it.houseNumber == null } }
                .map { if (it.size > 1) it.deduplicate() else it }
                .flatten()
        }

        // Use the last store as that is perhaps the last updated/created one
        val store = last()

        // The coordinates are often just cut after some digits
        val longitude = mapNotNull { it.longitude }.maxBy { it.toString().length }
        val latitude = mapNotNull { it.latitude }.maxBy { it.toString().length }

        // Combine all descriptions because we have no way of knowing which is the correct one
        val discounts = mapNotNull { it.discount }.toSet().joinToString("\n")

        val houseNumber = mapNotNull { it.houseNumber }.lastOrNull()
        val website = mapNotNull { it.website }.lastOrNull()
        val email = mapNotNull { it.email }.lastOrNull()
        val telephone = mapNotNull { it.telephone }.lastOrNull()
        val additionalAddressInformation = mapNotNull { it.additionalAddressInformation }.lastOrNull()

        logger.logRemoveDuplicates(store, size - 1)

        return listOf(
            AcceptingStore(
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
        )
    }

}
