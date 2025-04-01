package app.ehrenamtskarte.backend.stores.importer.common.steps

import app.ehrenamtskarte.backend.stores.importer.ImportConfig
import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.common.types.AcceptingStore
import app.ehrenamtskarte.backend.stores.importer.logRemoveDuplicates
import org.slf4j.Logger
import java.util.Locale

/**
 * Filters and removes duplicates.
 * For duplicates to be detected an exact match of name, postal code and street is necessary.
 * The properties of the last accepting store are used if there are multiple valid properties.
 */
class FilterDuplicates(
    config: ImportConfig,
    private val logger: Logger,
) : PipelineStep<List<AcceptingStore>, List<AcceptingStore>>(config) {
    override fun execute(input: List<AcceptingStore>): List<AcceptingStore> {
        // Group by name + postal code + street to detect duplicates
        val groups = input.groupBy {
            (it.name + it.postalCode + it.street).lowercase(Locale.GERMAN).filter { char -> char.isLetterOrDigit() }
        }

        return groups.values.map { it.deduplicate() }
    }

    private fun List<AcceptingStore>.deduplicate(): AcceptingStore {
        if (size == 1) return first() // No duplicates, nothing to do

        // Use the last as that is perhaps the last updated/created one
        val store = last()

        logger.logRemoveDuplicates(store, size - 1)
        val issuers = map { "'${it.districtName ?: it.freinetId.toString()}'" }.toSet().joinToString()
        logger.info("Duplicates issued by $issuers")

        val location = lastValue("locations") { it.location }
        val categoryId = lastValue("categoryIds") { it.categoryId }
        val houseNumber = lastValue("house numbers") { it.houseNumber }
        val website = lastValue("websites") { it.website }
        val email = lastValue("emails") { it.email }
        val telephone = lastValue("telephones") { it.telephone }
        val additionalAddressInformation = lastValue("additional address information") {
            it.additionalAddressInformation
        }

        // The coordinates are often just cut after some digits so use the one with the best precision
        val longitude = mapNotNull { it.longitude }.maxBy { it.toString().length }
        val latitude = mapNotNull { it.latitude }.maxBy { it.toString().length }

        // Combine all descriptions because we have no way of knowing which is the correct one
        val discounts = mapNotNull { it.discount }.toSet().joinToString("\n")

        return AcceptingStore(
            store.name,
            store.countryCode,
            location!!,
            store.postalCode,
            store.street,
            houseNumber,
            additionalAddressInformation,
            longitude,
            latitude,
            categoryId!!,
            email,
            telephone,
            website,
            discounts,
            store.freinetId,
            store.districtName,
        )
    }

    private fun <T : Any> List<AcceptingStore>.lastValue(property: String, transform: (AcceptingStore) -> T?): T? {
        val uniqueValues = mapNotNull { transform(it) }.toSet()

        if (uniqueValues.size > 1) {
            logger.info("$property: ${uniqueValues.joinToString("', '", "'", "'")}")
        }

        return uniqueValues.lastOrNull()
    }
}
