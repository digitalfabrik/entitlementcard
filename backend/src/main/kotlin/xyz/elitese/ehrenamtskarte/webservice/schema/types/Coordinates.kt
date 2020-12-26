package xyz.elitese.ehrenamtskarte.webservice.schema.types

import org.postgis.Point

data class Coordinates(
    val lat: Double,
    val lng: Double
) {
    companion object {
        fun fromPoint(point: Point): Coordinates {
            return Coordinates(point.x, point.y)
        }
    }
}
