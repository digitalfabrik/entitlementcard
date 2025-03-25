package app.ehrenamtskarte.backend.stores.database

import net.postgis.jdbc.PGgeometry
import net.postgis.jdbc.geometry.Point
import org.jetbrains.exposed.sql.Column
import org.jetbrains.exposed.sql.ColumnType
import org.jetbrains.exposed.sql.Table

class GeometryColumnType(val srid: Int = 4326) : ColumnType() {
    override fun sqlType() = "GEOMETRY(Point, $srid)"

    override fun valueFromDB(value: Any) = if (value is PGgeometry) value.geometry else value

    override fun notNullValueToDB(value: Any): Any {
        if (value is Point) {
            if (value.srid == Point.UNKNOWN_SRID) value.srid = srid
            return PGgeometry(value)
        }
        return value
    }
}

fun Table.point(
    name: String,
    srid: Int = 4326,
): Column<Point> = registerColumn(name, GeometryColumnType(srid))
