package app.ehrenamtskarte.backend.auth.database

import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.regions.database.Regions
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.javatime.datetime

object Administrators : IntIdTable() {
    val email = varchar("email", 100).uniqueIndex()
    val projectId = reference("projectId", Projects)
    val regionId = optReference("regionId", Regions)
    val role = varchar("role", 32)
    val passwordHash = binary("passwordHash").nullable()
    val passwordResetKey = varchar("passwordResetKey", 100).nullable()
    val passwordResetKeyExpiry = datetime("passwordResetKeyExpiry").nullable()
}

class AdministratorEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<AdministratorEntity>(Administrators)

    var email by Administrators.email
    var projectId by Administrators.projectId
    var regionId by Administrators.regionId
    var role by Administrators.role
    var passwordHash by Administrators.passwordHash
    var passwordResetKey by Administrators.passwordResetKey
    var passwordResetKeyExpiry by Administrators.passwordResetKeyExpiry
}
