package app.ehrenamtskarte.backend.auth.database

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable

object Administrators : IntIdTable() {
    val email = varchar("email", 100).uniqueIndex()
    val passwordHash = binary("passwordHash")
}

class AdministratorEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<AdministratorEntity>(Administrators)

    var email by Administrators.email
    var passwordHash by Administrators.passwordHash
}
