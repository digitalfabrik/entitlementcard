package app.ehrenamtskarte.backend.stores.importer

import app.ehrenamtskarte.backend.stores.importer.types.LbeAcceptingStore
import org.slf4j.Logger

data class FilterBuilder(val store: LbeAcceptingStore, val logger: Logger) {
    private val invalidLocations = arrayOf("Musterhausen")

    private fun String?.isNull(): Boolean {
        return this.isNullOrBlank() || matchesNa(this)
    }

    private fun filterName(): Boolean {
        val name = store.name

        return if (name.isNull()) {
            logger.info("'$store' was filtered out because name '$name' is invalid")
            false
        } else {
            true
        }
    }

    private fun filterLocation(): Boolean {
        val location = store.location

        return if (location.isNull() || invalidLocations.contains(location)) {
            logger.info("'${store.name}' was filtered out because location '$location' is invalid")
            false
        } else {
            true
        }
    }

    private fun filterLongitudeAndLatitude() = if (store.longitude.isNull() || store.latitude.isNull()) {
        logger.info("'${store.name}' was filtered out because longitude '${store.longitude}' or latitude '${store.latitude}' are invalid")
        false
    } else {
        true
    }

    private fun filterCategory(): Boolean {
        val category = store.category
        val validCategories = (0..9) + listOf(99)
        val valid = category?.toIntOrNull() in validCategories

        if (!valid)
            logger.info("'${store.name}' was filtered out because category '$category' is invalid")

        return valid
    }

    fun filter(): Boolean {
        return filterName() && filterCategory() && filterLocation() && filterLongitudeAndLatitude()
    }

}
