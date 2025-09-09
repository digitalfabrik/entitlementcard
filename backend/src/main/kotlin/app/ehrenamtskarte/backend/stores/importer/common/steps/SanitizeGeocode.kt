package app.ehrenamtskarte.backend.stores.importer.common.steps

import app.ehrenamtskarte.backend.stores.STREET_EXCLUDE_PATTERN
import app.ehrenamtskarte.backend.stores.geocoding.FeatureFetcher
import app.ehrenamtskarte.backend.stores.importer.ImportConfig
import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.common.types.AcceptingStore
import app.ehrenamtskarte.backend.stores.importer.logChange
import io.ktor.client.HttpClient
import kotlinx.coroutines.runBlocking
import org.geojson.Feature
import org.geojson.Point
import org.slf4j.Logger
import kotlin.math.cos
import kotlin.math.max

/**
 * Sanitize the postal code and the coordinates of the [AcceptingStore] using forward geocoding.
 * If the coordinates are not inside the bounding box of the postal code, one of those is wrong.
 * Then query by the address and use the coordinates OR postal code of the first match to sanitize the store data.
 */
class SanitizeGeocode(config: ImportConfig, private val logger: Logger, httpClient: HttpClient) :
    PipelineStep<List<AcceptingStore>, List<AcceptingStore>>(config) {
    private val featureFetcher = FeatureFetcher(config, httpClient)

    override fun execute(input: List<AcceptingStore>): List<AcceptingStore> =
        if (config.backendConfig.geocoding.enabled) {
            runBlocking {
                input.map { it.sanitize() }
            }
        } else {
            input
        }

    private suspend fun AcceptingStore.sanitize(): AcceptingStore {
        if (street?.contains(STREET_EXCLUDE_PATTERN) == true) return this

        val postalCodeBbox = if (postalCode != null) {
            featureFetcher.queryFeatures(listOf(Pair("postalcode", postalCode))).firstOrNull()?.bbox
        } else {
            null
        }

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


private const val DISTANCE_THRESHOLD_IN_KM = 1.0

/**
 * Returns whether the accepting store is closer than [DISTANCE_THRESHOLD_IN_KM] to the bounding box of the [feature]
 */
private fun AcceptingStore.isCloseToBoundingBox(feature: Feature): Boolean {
    if (latitude == null || longitude == null) return false
    return isCloseTo(feature.bbox, latitude, longitude, DISTANCE_THRESHOLD_IN_KM)
}

/**
 * Returns whether the accepting store is positioned inside the bounding box [bbox]
 */
private fun AcceptingStore.isInBoundingBox(bbox: DoubleArray): Boolean {
    if (latitude == null || longitude == null) return false
    return bbox[0] <= longitude && longitude <= bbox[2] && bbox[1] <= latitude && latitude <= bbox[3]
}

/**
 * Returns whether [latitude] and [longitude] are closer than [thresholdInKm] to the bounding box [bbox]
 */
private fun isCloseTo(bbox: DoubleArray, latitude: Double, longitude: Double, thresholdInKm: Double): Boolean {
    // Constants taken from https://stackoverflow.com/a/1253545/3245533
    val kmPerLatitudeDegree = 110.574
    val kmPerLongitudeDegree = 111.320 * cos(latitude.degreesToRadians())

    val deltaLatitude = thresholdInKm / kmPerLatitudeDegree
    val deltaLongitude = thresholdInKm / kmPerLongitudeDegree

    val longitudeInBounds = max(bbox[0] - longitude, longitude - bbox[2]) <= deltaLongitude
    val latitudeInBounds = max(bbox[1] - latitude, latitude - bbox[3]) <= deltaLatitude
    return longitudeInBounds && latitudeInBounds
}

private fun Double.degreesToRadians(): Double = this * Math.PI / 180
