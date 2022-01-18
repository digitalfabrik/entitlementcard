package app.ehrenamtskarte.backend.stores.importer.steps

import app.ehrenamtskarte.backend.common.STATE
import app.ehrenamtskarte.backend.stores.geocoding.FeatureFetcher
import app.ehrenamtskarte.backend.stores.geocoding.isCloseTo
import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.types.AcceptingStore
import io.ktor.client.HttpClient
import kotlinx.coroutines.runBlocking
import org.geojson.Feature
import org.geojson.Point
import org.slf4j.Logger

const val DISTANCE_THRESHOLD_IN_KM = 1.0

// Postal code lookup fails/does not really make sense for a "Postfach"
const val STREET_EXCLUDE_PATTERN = "Postfach"

class Sanitize(private val logger: Logger, httpClient: HttpClient) : PipelineStep<List<AcceptingStore>, List<AcceptingStore>>() {
    private val featureFetcher = FeatureFetcher(httpClient)

    override fun execute(input: List<AcceptingStore>): List<AcceptingStore> = runBlocking {
        val stateBbox = featureFetcher.queryFeatures(listOf(Pair("state", STATE))).first().bbox

        input.map { it.sanitize() }.filter {
            if (it.longitude == null || it.latitude == null) {
                logger.info("'${it.name}, ${it.location}' was filtered out because longitude or latitude are null")
                return@filter false
            }
            if (!it.isInBoundingBox(stateBbox)) {
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

    /**
     * Sanitize the postal code and the coordinates of the [AcceptingStore] using forward geocoding.
     * If the coordinates are not inside the bounding box of the postal code, one of those is wrong.
     * Then query by the address and use the coordinates OR postal code of the first match to sanitize the store data.
     */
    private suspend fun AcceptingStore.sanitize(): AcceptingStore {
        if (street?.contains(STREET_EXCLUDE_PATTERN) == true) return this

        val postalCodeBbox = if (postalCode != null) {
            featureFetcher.queryFeatures(listOf(Pair("postalcode", postalCode))).firstOrNull()?.bbox
        } else null

        // Postal code OR coordinates invalid
        if (postalCodeBbox == null || !isInBoundingBox(postalCodeBbox)) {
            val features = featureFetcher.queryFeatures(this)
            val feature = features.firstOrNull { isCloseToBoundingBox(it) || postalCode == it.postalCode() }

            // Match by postal code -> replace wrong coordinates
            if (feature != null && feature.postalCode() == postalCode) {
                val oldCoordinates = "$latitude, $longitude"
                val newCoordinates = "${feature.latitude()}, ${feature.longitude()}"

                logChange(this, "Coordinates", oldCoordinates, newCoordinates)

                return copy(longitude = feature.longitude(), latitude = feature.latitude())
            }

            // Match by coordinates -> replace wrong postal code
            val newPostalCode = feature?.postalCode() ?: postalCode
            logChange(this, "Postal code", postalCode, newPostalCode)

            return copy(postalCode = newPostalCode)
        }

        // Data seems to be correct
        return this
    }

    private fun AcceptingStore.isCloseToBoundingBox(feature: Feature): Boolean {
        if (latitude == null || longitude == null) return false
        return isCloseTo(feature.bbox, latitude, longitude, DISTANCE_THRESHOLD_IN_KM)
    }

    private fun AcceptingStore.isInBoundingBox(bbox: DoubleArray): Boolean {
        if (latitude == null || longitude == null) return false
        return bbox[0] <= longitude && longitude <= bbox[2] && bbox[1] <= latitude && latitude <= bbox[3]
    }

    private fun logChange(store: AcceptingStore, property: String, oldValue: String?, newValue: String?) {
        val storeInfo = listOfNotNull(store.name, store.location, store.street, store.houseNumber).joinToString()

        if (oldValue == newValue) {
            logger.info("$property of '$storeInfo' could not be improved, keeping '$oldValue'")
        } else {
            logger.info("$property of '$storeInfo' changed from '$oldValue' to '$newValue'")
        }
    }

    private fun Feature.latitude(): Double = (geometry as Point).coordinates.latitude
    private fun Feature.longitude(): Double = (geometry as Point).coordinates.longitude
    private fun Feature.postalCode(): String? = address()["postcode"]
    private fun Feature.address(): LinkedHashMap<String, String> =
        this.getProperty<LinkedHashMap<String, String>>("address")

}
