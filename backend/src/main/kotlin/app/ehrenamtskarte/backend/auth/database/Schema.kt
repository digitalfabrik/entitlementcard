package app.ehrenamtskarte.backend.auth.database

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable

object Administrators : IntIdTable() {
    val username = varchar("username", 100).uniqueIndex()
}

class AdministratorEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<AdministratorEntity>(Administrators)

    var username by Administrators.username
}
