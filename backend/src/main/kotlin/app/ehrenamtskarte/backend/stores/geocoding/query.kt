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

suspend fun queryFeatures(params: List<Pair<String, String>>): List<Feature> {
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
