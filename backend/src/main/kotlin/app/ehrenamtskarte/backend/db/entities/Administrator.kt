package app.ehrenamtskarte.backend.db.entities

import app.ehrenamtskarte.backend.auth.webservice.schema.types.Role
import app.ehrenamtskarte.backend.regions.database.Regions
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.Op
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.javatime.timestamp
import org.jetbrains.exposed.sql.lowerCase
import org.jetbrains.exposed.sql.or

object Administrators : IntIdTable() {
    val email = varchar("email", 254)
    val projectId = reference("projectId", Projects)
    val regionId = optReference("regionId", Regions)
    val role = varchar("role", 32)
    val passwordHash = binary("passwordHash").nullable()
    val passwordResetKeyHash = binary("passwordResetKeyHash").nullable()
    val passwordResetKeyExpiry = timestamp("passwordResetKeyExpiry").nullable()
    val notificationOnApplication = bool("notificationOnApplication").default(false)
    val notificationOnVerification = bool("notificationOnVerification").default(false)
    val deleted = bool("deleted")

    init {
        val noRegionCompatibleRoles = listOf(
            Role.PROJECT_ADMIN,
            Role.NO_RIGHTS,
            Role.PROJECT_STORE_MANAGER,
            Role.EXTERNAL_VERIFIED_API_USER,
        )
        val regionCompatibleRoles = listOf(Role.REGION_MANAGER, Role.REGION_ADMIN, Role.NO_RIGHTS)
        check("roleRegionCombinationConstraint") {
            regionId.isNull().and(role.inList(noRegionCompatibleRoles.map { it.db_value })) or
                regionId.isNotNull().and(role.inList(regionCompatibleRoles.map { it.db_value }))
        }
        check("deletedIfAndOnlyIfNoRights") {
            (deleted eq Op.TRUE and (role eq Role.NO_RIGHTS.db_value)) or
                (deleted eq Op.FALSE and (role neq Role.NO_RIGHTS.db_value))
        }
        uniqueIndex(customIndexName = "email_lower_idx", functions = listOf(email.lowerCase()))
    }
}

class AdministratorEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<AdministratorEntity>(Administrators)

    var email by Administrators.email
    var projectId by Administrators.projectId
    var regionId by Administrators.regionId
    var role by Administrators.role
    var passwordHash by Administrators.passwordHash
    var passwordResetKeyHash by Administrators.passwordResetKeyHash
    var passwordResetKeyExpiry by Administrators.passwordResetKeyExpiry
    var notificationOnApplication by Administrators.notificationOnApplication
    var notificationOnVerification by Administrators.notificationOnVerification
    var deleted by Administrators.deleted

    val project by ProjectEntity referencedOn Administrators.projectId

    fun isInProject(project: String): Boolean = this.project.project == project

    fun isInProject(projectId: Int): Boolean = this.projectId.value == projectId

    fun hasRole(role: Role, vararg other: Role): Boolean =
        this.role == role.db_value || other.any { this.role == it.db_value }

    fun isInRegion(regionId: Int): Boolean = this.regionId?.value == regionId
}

