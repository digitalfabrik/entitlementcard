package app.ehrenamtskarte.backend.stores.geocoding

import app.ehrenamtskarte.backend.stores.importer.common.types.AcceptingStore
import org.geojson.Feature
import kotlin.math.cos
import kotlin.math.max

const val DISTANCE_THRESHOLD_IN_KM = 1.0

/**
 * Returns whether the accepting store is closer than [DISTANCE_THRESHOLD_IN_KM] to the bounding box of the [feature]
 */
fun AcceptingStore.isCloseToBoundingBox(feature: Feature): Boolean {
    if (latitude == null || longitude == null) return false
    return isCloseTo(feature.bbox, latitude, longitude, DISTANCE_THRESHOLD_IN_KM)
}

/**
 * Returns whether the accepting store is positioned inside the bounding box [bbox]
 */
fun AcceptingStore.isInBoundingBox(bbox: DoubleArray): Boolean {
    if (latitude == null || longitude == null) return false
    return bbox[0] <= longitude && longitude <= bbox[2] && bbox[1] <= latitude && latitude <= bbox[3]
}

/**
 * Returns whether [latitude] and [longitude] are closer than [thresholdInKm] to the bounding box [bbox]
 */
fun isCloseTo(bbox: DoubleArray, latitude: Double, longitude: Double, thresholdInKm: Double): Boolean {
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
