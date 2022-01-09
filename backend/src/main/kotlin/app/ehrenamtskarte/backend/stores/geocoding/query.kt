package app.ehrenamtskarte.backend.stores.geocoding

import app.ehrenamtskarte.backend.common.COUNTRY_CODE
import app.ehrenamtskarte.backend.common.STATE
import app.ehrenamtskarte.backend.stores.importer.types.AcceptingStore
import com.fasterxml.jackson.databind.ObjectMapper
import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.http.*
import org.geojson.Feature
import org.geojson.FeatureCollection
import java.io.File

/**
 * Returns geocoding features matching the given [params].
 * The responses of the geocoding backend are cached as json files in a cache directory.
 */
suspend fun queryFeatures(params: List<Pair<String, String>>): List<Feature> {
    val fileName = cacheFileName(params)
    val file = File("${System.getProperty("user.dir")}/data/nominatim/v1/$fileName.json")

    val geoJson = if (file.exists()) {
        // Use a cached version on disk.
        file.readText()
    } else {
        val client = HttpClient()
        val response = client.request<String> {
            url {
                protocol = URLProtocol.HTTP
                host = System.getProperty("app.geocoding.host")
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

/**
 * Returns geocoding features matching the address of the [store].
 * If the full address does not return any results, first retry without house number and then without street.
 * Only features inside the [STATE] are queried.
 */
suspend fun queryFeatures(store: AcceptingStore): List<Feature> {
    val street = store.street
    val houseNumber = store.houseNumber

    val baseParameters = listOf(Pair("state", STATE), Pair("city", store.location))

    if (street != null && houseNumber != null) {
        val address = listOf(houseNumber, street).joinToString(" ")
        val features = queryFeatures(baseParameters.plus(Pair("street", address)))
        if (features.isNotEmpty()) return features
    }
    if (street != null) {
        val features = queryFeatures(baseParameters.plus(Pair("street", street)))
        if (features.isNotEmpty()) return features
    }

    return queryFeatures(baseParameters)
}

/**
 * Returns the sanitized file name from the joined [parameters] values
 */
private fun cacheFileName(parameters: List<Pair<String, String>>): String {
    return parameters.joinToString("_") { it.second }.sanitizeFileName()
}

/**
 * Returns the sanitized [String]:
 * - whitespaces are replaced with '_'
 * - all chars that are not letters, digits, '-' or '_' are removed
 */
private fun String.sanitizeFileName(): String {
    return replace(" ", "_").filter { it.isLetterOrDigit() || it == '_' || it == '-' }
}
