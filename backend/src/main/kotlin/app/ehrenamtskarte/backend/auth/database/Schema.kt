package app.ehrenamtskarte.backend.auth.database

import app.ehrenamtskarte.backend.auth.webservice.schema.types.Role
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.regions.database.Regions
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.Op
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.javatime.datetime
import org.jetbrains.exposed.sql.or
import org.jetbrains.exposed.sql.transactions.TransactionManager

object Administrators : IntIdTable() {
    val email = varchar("email", 100)
    val projectId = reference("projectId", Projects)
    val regionId = optReference("regionId", Regions)
    val role = varchar("role", 32)
    val passwordHash = binary("passwordHash").nullable()
    val passwordResetKey = varchar("passwordResetKey", 100).nullable()
    val passwordResetKeyExpiry = datetime("passwordResetKeyExpiry").nullable()
    val deleted = bool("deleted")

    init {
        val noRegionCompatibleRoles = listOf(Role.PROJECT_ADMIN, Role.NO_RIGHTS)
        val regionCompatibleRoles = listOf(Role.REGION_MANAGER, Role.REGION_ADMIN, Role.NO_RIGHTS)
        check("roleRegionCombinationConstraint") {
            regionId.isNull().and(role.inList(noRegionCompatibleRoles.map { it.db_value })) or
                regionId.isNotNull().and(role.inList(regionCompatibleRoles.map { it.db_value }))
        }
        check("deletedIfAndOnlyIfNoRights") {
            (deleted eq Op.TRUE and (role eq Role.NO_RIGHTS.db_value)) or
                (deleted eq Op.FALSE and (role neq Role.NO_RIGHTS.db_value))
        }
    }
}

fun createEmailIndexIfNotExists() {
    val sql = "CREATE UNIQUE INDEX IF NOT EXISTS email_lower_idx ON ${Administrators.nameInDatabaseCase()} (lower(${Administrators.email.nameInDatabaseCase()}))"
    TransactionManager.current().exec(sql)
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
    var deleted by Administrators.deleted
}
