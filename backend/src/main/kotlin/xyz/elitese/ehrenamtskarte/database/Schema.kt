package xyz.elitese.ehrenamtskarte.database

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.Column
import org.jetbrains.exposed.sql.ColumnType
import org.jetbrains.exposed.sql.Table
import org.postgis.PGgeometry
import org.postgis.Point

object Categories : IntIdTable() {
    val name = varchar("name", 50)
}

class CategoryEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<CategoryEntity>(Categories)
    var name by Categories.name
}

object Contacts : IntIdTable() {
    val email = varchar("email", 100)
    val telephone = varchar("telephone", 50)
    val website = varchar("website", 150)
}

class ContactEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object :  IntEntityClass<ContactEntity>(Contacts)
    var email by Contacts.email
    var telephone by Contacts.telephone
    var website by Contacts.website
}

object AcceptingStores : IntIdTable() {
    val name = varchar("name", 150)
    val description = varchar("description", 2500)
    val location = point("location")
    val address = varchar("address", 200)
    val contactId = reference("contactId", Contacts)
    val categoryId = reference("categoryId", Categories)
}

class AcceptingStoreEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<AcceptingStoreEntity>(AcceptingStores)
    var name by AcceptingStores.name
    var contactId by AcceptingStores.contactId
    var categoryId by AcceptingStores.categoryId
}

fun Table.point(name: String, srid: Int = 4326) : Column<Point>
        = registerColumn(name, PointColumnType(srid))

private class PointColumnType(val srid: Int = 4326) : ColumnType() {
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
