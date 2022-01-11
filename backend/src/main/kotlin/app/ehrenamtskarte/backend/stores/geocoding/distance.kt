package app.ehrenamtskarte.backend.stores.geocoding

import kotlin.math.*

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

