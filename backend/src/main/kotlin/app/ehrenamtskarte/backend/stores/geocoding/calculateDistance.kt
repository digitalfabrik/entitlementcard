package app.ehrenamtskarte.backend.stores.geocoding

import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.sqrt

const val EARTH_RADIUS_IN_KM = 6371

fun calculateDistanceInKm(latitude1: Double, longitude1: Double, latitude2: Double, longitude2: Double): Double {
    // Adjusted from https://www.movable-type.co.uk/scripts/latlong.html by Chris Veness licensed under MIT
    val distanceLatitude = (latitude1 - latitude2).degreesToRadians()
    val distanceLongitude = (longitude1 - longitude2).degreesToRadians()

    val latitudeRadians1 = latitude1.degreesToRadians()
    val latitudeRadians2 = latitude2.degreesToRadians()

    val a = sin(distanceLatitude / 2) * sin(distanceLatitude / 2) +
            sin(distanceLongitude / 2) * sin(distanceLongitude / 2) * cos(latitudeRadians1) * cos(latitudeRadians2)
    val c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return EARTH_RADIUS_IN_KM * c
}

private fun Double.degreesToRadians(): Double = this * Math.PI / 180

