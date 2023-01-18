package app.ehrenamtskarte.backend.stores.importer.nuernberg.steps

import app.ehrenamtskarte.backend.stores.STREET_EXCLUDE_PATTERN
import app.ehrenamtskarte.backend.stores.geocoding.FeatureFetcher
import app.ehrenamtskarte.backend.stores.geocoding.isCloseToBoundingBox
import app.ehrenamtskarte.backend.stores.geocoding.isInBoundingBox
import app.ehrenamtskarte.backend.stores.importer.ImportConfig
import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.common.types.AcceptingStore
import io.ktor.client.HttpClient
import kotlinx.coroutines.runBlocking
import org.geojson.Feature
import org.geojson.Point

/**
 * Sanitize the postal code and the coordinates of the [AcceptingStore] using forward geocoding.
 * If the coordinates are not inside the bounding box of the postal code, one of those is wrong.
 * Then query by the address and use the coordinates OR postal code of the first match to sanitize the store data.
 */
class SanitizeGeocode(config: ImportConfig, httpClient: HttpClient) :
    PipelineStep<List<AcceptingStore>, List<AcceptingStore>>(config) {
    private val featureFetcher = FeatureFetcher(config, httpClient)

    override fun execute(input: List<AcceptingStore>): List<AcceptingStore> = runBlocking {
        // TODO improve geodata update https://github.com/digitalfabrik/entitlementcard/issues/735
        input.map { it.sanitize() }
    }

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
                return copy(longitude = feature.longitude(), latitude = feature.latitude())
            }
        }

        return this
    }

    private fun Feature.latitude(): Double = (geometry as Point).coordinates.latitude
    private fun Feature.longitude(): Double = (geometry as Point).coordinates.longitude
    private fun Feature.postalCode(): String? = address()["postcode"]
    private fun Feature.address(): LinkedHashMap<String, String> =
        this.getProperty<LinkedHashMap<String, String>>("address")
}
