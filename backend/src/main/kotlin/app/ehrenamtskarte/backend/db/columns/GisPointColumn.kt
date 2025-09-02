package app.ehrenamtskarte.backend.db.columns

import net.postgis.jdbc.PGgeometry
import net.postgis.jdbc.geometry.Point
import org.jetbrains.exposed.sql.Column
import org.jetbrains.exposed.sql.ColumnType
import org.jetbrains.exposed.sql.Table

/**
 * @see https://en.wikipedia.org/wiki/World_Geodetic_System#Identifiers
 */
const val SSRID_WGS84: Int = 4326

class GisPointColumn(val srid: Int = SSRID_WGS84) : ColumnType<Point>() {
    override fun sqlType() = "GEOMETRY(Point, $srid)"

    override fun valueFromDB(value: Any): Point {
        require(value is PGgeometry) {
            "Cannot convert DB value of type ${value.javaClass.name} to PGgeometry"
        }
        return value.geometry as Point
    }

    override fun notNullValueToDB(value: Point): PGgeometry {
        if (value.srid == Point.UNKNOWN_SRID) {
            value.srid = srid
        }
        return PGgeometry(value)
    }
}

fun Table.gisPoint(name: String, srid: Int = SSRID_WGS84): Column<Point> = registerColumn(name, GisPointColumn(srid))
