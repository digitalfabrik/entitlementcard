package app.ehrenamtskarte.backend.stores.importer.steps

import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.types.AcceptingStore
import com.fasterxml.jackson.databind.ObjectMapper
import io.ktor.client.HttpClient
import io.ktor.client.request.request
import io.ktor.http.*
import kotlinx.coroutines.runBlocking
import org.geojson.Feature
import org.geojson.FeatureCollection
import org.geojson.Point
import org.slf4j.Logger
import java.io.File
import kotlin.math.*

const val STATE = "Bayern"

const val DISTANCE_THRESHOLD_IN_KM = 5

// Postal code lookup fails/does not really make sense for a "Postfach"
const val STREET_EXCLUDE_PATTERN = "Postfach"

class Sanitize(private val logger: Logger) : PipelineStep<List<AcceptingStore>, List<AcceptingStore>>() {

    override fun execute(input: List<AcceptingStore>): List<AcceptingStore> = runBlocking {
        val stateFeature = query(listOf(Pair("state", STATE))).first()
        input.map { store ->
            if (store.street != null && store.street.contains(STREET_EXCLUDE_PATTERN)) return@map store

            val storeInfo = listOfNotNull(store.name, store.location, store.street, store.houseNumber).joinToString()
            val postalCode = store.postalCode

            val postalCodeFeature = if (postalCode != null) {
                query(listOf(Pair("postalcode", postalCode))).firstOrNull()
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
        return isInBoundingBox(feature) || distanceKm(feature) <= DISTANCE_THRESHOLD_IN_KM
    }

    private fun AcceptingStore.isInBoundingBox(feature: Feature): Boolean {
        val bbox = feature.bbox
        return bbox[0] <= longitude && longitude <= bbox[2] && bbox[1] <= latitude && latitude <= bbox[3]
    }

    private fun AcceptingStore.distanceKm(feature: Feature): Double {
        // Adjusted from https://www.movable-type.co.uk/scripts/latlong.html by Chris Veness licensed under MIT
        val earthRadiusKm = 6371

        val distanceLatitude = (latitude - feature.latitude()).degreesToRadians()
        val distanceLongitude = (longitude - feature.longitude()).degreesToRadians()

        val latitudeRadians1 = latitude.degreesToRadians()
        val latitudeRadians2 = feature.latitude().degreesToRadians()

        val a = sin(distanceLatitude / 2) * sin(distanceLatitude / 2) +
                sin(distanceLongitude / 2) * sin(distanceLongitude / 2) * cos(latitudeRadians1) * cos(latitudeRadians2)
        val c = 2 * atan2(sqrt(a), sqrt(1 - a))
        return earthRadiusKm * c
    }

    private suspend fun query(params: List<Pair<String, String>>): List<Feature> {
        val fileName = params.joinToString("_") { it.second }
            .replace(" ", "_")
            .replace("/", "")
            .replace(".", "")

        val file = File("${System.getProperty("user.dir")}/data/nominatim/v1/$fileName.json")

        val geoJson = if (file.exists()) {
            // Use a cached version on disk.
            file.readText()
        } else {
            val client = HttpClient()
            val response = client.request<String> {
                url {
                    protocol = URLProtocol.HTTP
                    host = "nominatim.maps.tuerantuer.org"
                    path("nominatim", "search")
                    parameters.append("format", "geojson")
                    parameters.append("addressdetails", "1")
                    parameters.append("countrycodes", COUNTRY_CODE)
                    params.forEach {
                        parameters.append(it.first, it.second)
                    }
                }
                method = HttpMethod.Get
            }
            file.parentFile.mkdirs()
            file.writeText(response)
            response
        }

        return ObjectMapper().readValue<FeatureCollection>(geoJson, FeatureCollection::class.java).features
    }

    private suspend fun queryFeatures(store: AcceptingStore): List<Feature> {
        val street = store.street
        val houseNumber = store.houseNumber

        val baseParameters = listOf(Pair("state", STATE), Pair("city", store.location))

        if (street != null && houseNumber != null) {
            val address = listOf(houseNumber, street).joinToString(" ")
            val features = query(baseParameters.plus(Pair("street", address)))
            if (features.isNotEmpty()) return features
        }
        if (street != null) {
            val features = query(baseParameters.plus(Pair("street", street)))
            if (features.isNotEmpty()) return features
        }

        return query(baseParameters)
    }

    private fun Feature.latitude(): Double = (geometry as Point).coordinates.latitude
    private fun Feature.longitude(): Double = (geometry as Point).coordinates.longitude
    private fun Feature.postalCode(): String? = address()["postcode"]
    private fun Feature.address(): LinkedHashMap<String, String> =
        this.getProperty<LinkedHashMap<String, String>>("address")

    private fun Double.degreesToRadians(): Double = this * Math.PI / 180

}
