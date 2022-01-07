package app.ehrenamtskarte.backend.stores.importer.steps

import app.ehrenamtskarte.backend.common.STATE
import app.ehrenamtskarte.backend.stores.geocoding.calculateDistanceInKm
import app.ehrenamtskarte.backend.stores.geocoding.queryFeatures
import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.types.AcceptingStore
import kotlinx.coroutines.runBlocking
import org.geojson.Feature
import org.geojson.Point
import org.slf4j.Logger

const val DISTANCE_THRESHOLD_IN_KM = 5

// Postal code lookup fails/does not really make sense for a "Postfach"
const val STREET_EXCLUDE_PATTERN = "Postfach"

class Sanitize(private val logger: Logger) : PipelineStep<List<AcceptingStore>, List<AcceptingStore>>() {

    override fun execute(input: List<AcceptingStore>): List<AcceptingStore> = runBlocking {
        val stateFeature = queryFeatures(listOf(Pair("state", STATE))).first()
        input.map { store ->
            if (store.street != null && store.street.contains(STREET_EXCLUDE_PATTERN)) return@map store

            val storeInfo = listOfNotNull(store.name, store.location, store.street, store.houseNumber).joinToString()
            val postalCode = store.postalCode

            val postalCodeFeature = if (postalCode != null) {
                queryFeatures(listOf(Pair("postalcode", postalCode))).firstOrNull()
            } else null

            if (postalCodeFeature == null) {
                // Postal code invalid. If we find a feature with matching address and coordinates use its postal code.
                val features = queryFeatures(store)
                val feature = features.firstOrNull { store.isCloseTo(it) }
                val newPostalCode = feature?.postalCode() ?: postalCode
                logger.info("Postal code of '$storeInfo' was changed from '$postalCode' to '$newPostalCode'")
                return@map store.copy(postalCode = newPostalCode)
            }

            if (!store.isCloseTo(postalCodeFeature)) {
                // Postal code OR coordinates invalid. Use coordinates/postal code of best match for address.
                val features = queryFeatures(store)
                val feature = features.firstOrNull { store.isCloseTo(it) || postalCode == it.postalCode() }

                if (feature != null && feature.postalCode() == store.postalCode) {
                    // Match by postal code, wrong coordinates
                    val oldCoordinates = "${store.latitude}, ${store.longitude}"
                    val newCoordinates = "${feature.latitude()}, ${feature.longitude()}"
                    logger.info("Coordinates of '$storeInfo' was changed from '$oldCoordinates' to '$newCoordinates'")
                    return@map store.copy(longitude = feature.longitude(), latitude = feature.latitude())
                }
                // Match by coordinates, wrong postal code
                val newPostalCode = feature?.postalCode() ?: postalCode
                logger.info("Postal code of '$storeInfo' was changed from '$postalCode' to '$newPostalCode'")
                return@map store.copy(postalCode = newPostalCode)
            }

            store
        }.filter {
            if (!it.isInBoundingBox(stateFeature)) {
                logger.info("'${it.name}, ${it.location}' was filtered out because it is outside of $STATE")
                return@filter false
            }
            if (it.postalCode == null) {
                // Probably because it is outside of the state but inside the bounding box of the state
                logger.info("'${it.name}, ${it.location}' was filtered out because its postal code is null")
                return@filter false
            }
            true
        }
    }

    private fun AcceptingStore.isCloseTo(feature: Feature): Boolean {
        return isInBoundingBox(feature) || calculateDistanceInKm(
            latitude,
            longitude,
            feature.latitude(),
            feature.longitude()
        ) <= DISTANCE_THRESHOLD_IN_KM
    }

    private fun AcceptingStore.isInBoundingBox(feature: Feature): Boolean {
        val bbox = feature.bbox
        return bbox[0] <= longitude && longitude <= bbox[2] && bbox[1] <= latitude && latitude <= bbox[3]
    }

    private fun Feature.latitude(): Double = (geometry as Point).coordinates.latitude
    private fun Feature.longitude(): Double = (geometry as Point).coordinates.longitude
    private fun Feature.postalCode(): String? = address()["postcode"]
    private fun Feature.address(): LinkedHashMap<String, String> =
        this.getProperty<LinkedHashMap<String, String>>("address")

}
