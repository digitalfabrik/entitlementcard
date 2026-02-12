package app.ehrenamtskarte.backend.db.entities

import app.ehrenamtskarte.backend.graphql.auth.types.Role
import app.ehrenamtskarte.backend.graphql.shared.EAK_BAYERN_PROJECT
import app.ehrenamtskarte.backend.graphql.shared.KOBLENZ_PASS_PROJECT
import org.jetbrains.exposed.v1.core.Op
import org.jetbrains.exposed.v1.core.and
import org.jetbrains.exposed.v1.core.dao.id.EntityID
import org.jetbrains.exposed.v1.core.dao.id.IntIdTable
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.core.inList
import org.jetbrains.exposed.v1.core.isNotNull
import org.jetbrains.exposed.v1.core.isNull
import org.jetbrains.exposed.v1.core.lowerCase
import org.jetbrains.exposed.v1.core.neq
import org.jetbrains.exposed.v1.core.or
import org.jetbrains.exposed.v1.dao.IntEntity
import org.jetbrains.exposed.v1.dao.IntEntityClass
import org.jetbrains.exposed.v1.javatime.timestamp
import org.jetbrains.exposed.v1.jdbc.transactions.transaction

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

    fun hasRole(role: Role, vararg other: Role): Boolean =
        this.role == role.db_value || other.any { this.role == it.db_value }

    fun isInProject(project: String): Boolean = this.project.project == project

    fun isInProject(projectId: Int): Boolean = this.projectId.value == projectId

    fun isInRegion(regionId: Int): Boolean = this.regionId?.value == regionId
}

fun AdministratorEntity.mayCreateCardInRegion(regionId: Int): Boolean =
    isInRegion(regionId) && hasRole(Role.REGION_MANAGER, Role.REGION_ADMIN)

fun AdministratorEntity.mayDeleteCardInRegion(regionId: Int): Boolean =
    isInRegion(regionId) && hasRole(Role.REGION_MANAGER, Role.REGION_ADMIN)

fun AdministratorEntity.mayViewApplicationsInRegion(regionId: Int): Boolean =
    isInRegion(regionId) && hasRole(Role.REGION_MANAGER, Role.REGION_ADMIN)

fun AdministratorEntity.mayUpdateApplicationsInRegion(regionId: Int): Boolean =
    isInRegion(regionId) && hasRole(Role.REGION_MANAGER, Role.REGION_ADMIN)

fun AdministratorEntity.mayDeleteApplicationsInRegion(regionId: Int): Boolean =
    isInRegion(regionId) && hasRole(Role.REGION_MANAGER, Role.REGION_ADMIN)

fun AdministratorEntity.mayUpdateSettingsInRegion(regionId: Int): Boolean =
    isInRegion(regionId) && hasRole(Role.REGION_ADMIN)

fun AdministratorEntity.mayViewUsersInProject(projectId: Int): Boolean =
    isInProject(projectId) && hasRole(Role.PROJECT_ADMIN)

fun AdministratorEntity.mayViewUsersInRegion(region: RegionEntity): Boolean =
    mayViewUsersInProject(region.projectId.value) ||
        (hasRole(Role.REGION_ADMIN) && isInRegion(region.id.value))

fun AdministratorEntity.maySendMailsInRegion(regionId: Int): Boolean =
    isInRegion(regionId) && hasRole(Role.REGION_MANAGER, Role.REGION_ADMIN)

fun AdministratorEntity.mayViewCardStatisticsInProject(projectId: Int): Boolean =
    isInProject(projectId) && hasRole(Role.PROJECT_ADMIN)

fun AdministratorEntity.mayViewCardStatisticsInRegion(regionId: Int): Boolean =
    hasRole(Role.REGION_ADMIN) && isInRegion(regionId)

fun AdministratorEntity.mayCreateUser(
    newAdminProjectId: Int,
    newAdminRole: Role,
    newAdminRegion: RegionEntity?,
): Boolean {
    if (projectId.value != newAdminProjectId || newAdminRole == Role.NO_RIGHTS) {
        return false
    }
    if (hasRole(Role.PROJECT_ADMIN)) {
        if (newAdminRole == Role.EXTERNAL_VERIFIED_API_USER) {
            return transaction { isInProject(EAK_BAYERN_PROJECT) }
        }
        return true
    }
    return hasRole(Role.REGION_ADMIN) &&
        newAdminRegion != null &&
        regionId == newAdminRegion.id &&
        newAdminRole in setOf(Role.REGION_ADMIN, Role.REGION_MANAGER)
}

fun AdministratorEntity.mayEditUser(
    existingAdmin: AdministratorEntity,
    newAdminProjectId: Int,
    newAdminRole: Role,
    newAdminRegion: RegionEntity?,
): Boolean {
    if (!isInProject(newAdminProjectId) ||
        !existingAdmin.isInProject(newAdminProjectId) ||
        newAdminRole == Role.NO_RIGHTS
    ) {
        return false
    }
    if (hasRole(Role.PROJECT_ADMIN)) {
        if (newAdminRole == Role.EXTERNAL_VERIFIED_API_USER) {
            return transaction { isInProject(EAK_BAYERN_PROJECT) }
        }
        return true
    }
    return hasRole(Role.REGION_ADMIN) &&
        existingAdmin.regionId == regionId &&
        newAdminRegion != null &&
        regionId == newAdminRegion.id &&
        newAdminRole in setOf(Role.REGION_ADMIN, Role.REGION_MANAGER)
}

fun AdministratorEntity.mayDeleteUser(existingAdmin: AdministratorEntity): Boolean {
    if (projectId != existingAdmin.projectId) {
        return false
    }
    if (hasRole(Role.PROJECT_ADMIN)) {
        return true
    }
    return hasRole(Role.REGION_ADMIN) && existingAdmin.regionId == regionId
}

fun AdministratorEntity.mayUpdateStoresInProject(projectId: Int): Boolean =
    this.projectId.value == projectId && hasRole(Role.PROJECT_STORE_MANAGER)

fun AdministratorEntity.mayViewFreinetAgencyInformationInRegion(regionId: Int): Boolean =
    hasRole(Role.REGION_ADMIN) && isInRegion(regionId) && isInProject(EAK_BAYERN_PROJECT)

fun AdministratorEntity.mayUpdateFreinetAgencyInformationInRegion(regionId: Int): Boolean =
    hasRole(Role.REGION_ADMIN) && isInRegion(regionId) && isInProject(EAK_BAYERN_PROJECT)

fun AdministratorEntity.mayAddApiTokensInProject(): Boolean =
    transaction {
        (hasRole(Role.PROJECT_ADMIN) && isInProject(KOBLENZ_PASS_PROJECT)) ||
            (hasRole(Role.EXTERNAL_VERIFIED_API_USER) && isInProject(EAK_BAYERN_PROJECT))
    }

fun AdministratorEntity.mayViewApiMetadataInProject(): Boolean =
    hasRole(Role.PROJECT_ADMIN) || hasRole(Role.EXTERNAL_VERIFIED_API_USER)

fun AdministratorEntity.mayDeleteApiTokensInProject(): Boolean =
    hasRole(Role.PROJECT_ADMIN) || hasRole(Role.EXTERNAL_VERIFIED_API_USER)

fun AdministratorEntity.mayViewHashingPepper(): Boolean =
    transaction {
        isInProject(KOBLENZ_PASS_PROJECT) && hasRole(Role.PROJECT_ADMIN)
    }
