package app.ehrenamtskarte.backend.stores.importer.steps

import app.ehrenamtskarte.backend.stores.geocoding.FeatureFetcher
import app.ehrenamtskarte.backend.stores.geocoding.isCloseToBoundingBox
import app.ehrenamtskarte.backend.stores.geocoding.isInBoundingBox
import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.logChange
import app.ehrenamtskarte.backend.stores.importer.types.AcceptingStore
import io.ktor.client.HttpClient
import kotlinx.coroutines.runBlocking
import org.geojson.Feature
import org.geojson.Point
import org.slf4j.Logger

// Postal code lookup fails/does not really make sense for a "Postfach"
const val STREET_EXCLUDE_PATTERN = "Postfach"

class Sanitize(private val logger: Logger, httpClient: HttpClient) : PipelineStep<List<AcceptingStore>, List<AcceptingStore>>() {
    private val featureFetcher = FeatureFetcher(httpClient)

    override fun execute(input: List<AcceptingStore>): List<AcceptingStore> = runBlocking {
        input.map { it.sanitize() }
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

                logger.logChange(this, "Coordinates", oldCoordinates, newCoordinates)

                return copy(longitude = feature.longitude(), latitude = feature.latitude())
            }

            // Match by coordinates -> replace wrong postal code
            val newPostalCode = feature?.postalCode() ?: postalCode
            logger.logChange(this, "Postal code", postalCode, newPostalCode)

            return copy(postalCode = newPostalCode)
        }

        // Data seems to be correct
        return this
    }

    private fun Feature.latitude(): Double = (geometry as Point).coordinates.latitude
    private fun Feature.longitude(): Double = (geometry as Point).coordinates.longitude
    private fun Feature.postalCode(): String? = address()["postcode"]
    private fun Feature.address(): LinkedHashMap<String, String> =
        this.getProperty<LinkedHashMap<String, String>>("address")

}
