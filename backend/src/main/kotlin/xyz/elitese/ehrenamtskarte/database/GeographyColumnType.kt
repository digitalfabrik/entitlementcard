package xyz.elitese.ehrenamtskarte.database

import org.jetbrains.exposed.sql.ColumnType
import org.postgis.PGgeography
import org.postgis.PGgeometry
import org.postgis.Point


class GeographyColumnType(val srid: Int = 4326) : ColumnType() {
    override fun sqlType() = "GEOGRAPHY(Point, $srid)"
    override fun valueFromDB(value: Any) = if (value is PGgeography) value.geometry else value
    override fun notNullValueToDB(value: Any): Any {
        if (value is Point) {
            if (value.srid == Point.UNKNOWN_SRID) value.srid = srid
            return PGgeometry(value)
        }
        return value
    }
}
