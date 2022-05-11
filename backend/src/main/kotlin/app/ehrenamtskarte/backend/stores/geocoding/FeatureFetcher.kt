package app.ehrenamtskarte.backend.stores.geocoding

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.stores.COUNTRY_CODE
import app.ehrenamtskarte.backend.stores.STATE
import app.ehrenamtskarte.backend.stores.importer.ImportConfig
import app.ehrenamtskarte.backend.stores.importer.types.AcceptingStore
import com.fasterxml.jackson.databind.ObjectMapper
import io.ktor.client.HttpClient
import io.ktor.client.request.*
import io.ktor.http.*
import org.geojson.Feature
import org.geojson.FeatureCollection

class FeatureFetcher(private val config: ImportConfig, private val httpClient: HttpClient) {
    /**
     * Returns geocoding features matching the given [params].
     */
    suspend fun queryFeatures(params: List<Pair<String, String>>): List<Feature> {
        val geoJson =  httpClient.request<String> {
            url {
                protocol = URLProtocol.HTTP
                host = config.backendConfig.geocoding.host
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
}
