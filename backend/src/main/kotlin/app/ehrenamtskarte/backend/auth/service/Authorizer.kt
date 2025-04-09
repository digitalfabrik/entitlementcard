package app.ehrenamtskarte.backend.auth.service

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Role
import app.ehrenamtskarte.backend.common.webservice.EAK_BAYERN_PROJECT
import app.ehrenamtskarte.backend.common.webservice.KOBLENZ_PASS_PROJECT
import app.ehrenamtskarte.backend.regions.database.RegionEntity
import org.jetbrains.exposed.sql.transactions.transaction

object Authorizer {
    fun mayCreateCardInRegion(user: AdministratorEntity, regionId: Int): Boolean =
        user.isInRegion(regionId) && user.hasRole(Role.REGION_MANAGER, Role.REGION_ADMIN)

    fun mayDeleteCardInRegion(user: AdministratorEntity, regionId: Int): Boolean =
        user.isInRegion(regionId) && user.hasRole(Role.REGION_MANAGER, Role.REGION_ADMIN)

    fun mayViewApplicationsInRegion(user: AdministratorEntity, regionId: Int): Boolean =
        user.isInRegion(regionId) && user.hasRole(Role.REGION_MANAGER, Role.REGION_ADMIN)

    fun mayUpdateApplicationsInRegion(user: AdministratorEntity, regionId: Int): Boolean =
        user.isInRegion(regionId) && user.hasRole(Role.REGION_MANAGER, Role.REGION_ADMIN)

    fun mayDeleteApplicationsInRegion(user: AdministratorEntity, regionId: Int): Boolean =
        user.isInRegion(regionId) && user.hasRole(Role.REGION_MANAGER, Role.REGION_ADMIN)

    fun mayUpdateSettingsInRegion(user: AdministratorEntity, regionId: Int): Boolean =
        user.isInRegion(regionId) && user.hasRole(Role.REGION_ADMIN)

    fun mayViewUsersInProject(user: AdministratorEntity, projectId: Int): Boolean =
        user.isInProject(projectId) && user.hasRole(Role.PROJECT_ADMIN)

    fun mayViewUsersInRegion(user: AdministratorEntity, region: RegionEntity): Boolean =
        mayViewUsersInProject(user, region.projectId.value) ||
            (user.hasRole(Role.REGION_ADMIN) && user.isInRegion(region.id.value))

    fun maySendMailsInRegion(user: AdministratorEntity, regionId: Int): Boolean =
        user.isInRegion(regionId) && user.hasRole(Role.REGION_MANAGER, Role.REGION_ADMIN)

    fun mayViewCardStatisticsInProject(user: AdministratorEntity, projectId: Int): Boolean =
        user.isInProject(projectId) && user.hasRole(Role.PROJECT_ADMIN)

    fun mayViewCardStatisticsInRegion(user: AdministratorEntity, regionId: Int): Boolean =
        user.hasRole(Role.REGION_ADMIN) && user.isInRegion(regionId)

    fun mayCreateUser(
        actingAdmin: AdministratorEntity,
        newAdminProjectId: Int,
        newAdminRole: Role,
        newAdminRegion: RegionEntity?,
    ): Boolean {
        if (actingAdmin.projectId.value != newAdminProjectId || newAdminRole == Role.NO_RIGHTS) {
            return false
        }
        if (actingAdmin.hasRole(Role.PROJECT_ADMIN)) {
            if (newAdminRole == Role.EXTERNAL_VERIFIED_API_USER) {
                return transaction { actingAdmin.isInProject(EAK_BAYERN_PROJECT) }
            }
            return true
        }
        return actingAdmin.hasRole(Role.REGION_ADMIN) &&
            newAdminRegion != null &&
            actingAdmin.regionId == newAdminRegion.id &&
            newAdminRole in setOf(Role.REGION_ADMIN, Role.REGION_MANAGER)
    }

    fun mayEditUser(
        actingAdmin: AdministratorEntity,
        existingAdmin: AdministratorEntity,
        newAdminProjectId: Int,
        newAdminRole: Role,
        newAdminRegion: RegionEntity?,
    ): Boolean {
        if (!actingAdmin.isInProject(newAdminProjectId) ||
            !existingAdmin.isInProject(newAdminProjectId) ||
            newAdminRole == Role.NO_RIGHTS
        ) {
            return false
        }
        if (actingAdmin.hasRole(Role.PROJECT_ADMIN)) {
            if (newAdminRole == Role.EXTERNAL_VERIFIED_API_USER) {
                return transaction { actingAdmin.isInProject(EAK_BAYERN_PROJECT) }
            }
            return true
        }
        return actingAdmin.hasRole(Role.REGION_ADMIN) &&
            existingAdmin.regionId == actingAdmin.regionId &&
            newAdminRegion != null &&
            actingAdmin.regionId == newAdminRegion.id &&
            newAdminRole in setOf(Role.REGION_ADMIN, Role.REGION_MANAGER)
    }

    fun mayDeleteUser(actingAdmin: AdministratorEntity, existingAdmin: AdministratorEntity): Boolean {
        if (actingAdmin.projectId != existingAdmin.projectId) {
            return false
        }
        if (actingAdmin.hasRole(Role.PROJECT_ADMIN)) {
            return true
        }
        return actingAdmin.hasRole(Role.REGION_ADMIN) && existingAdmin.regionId == actingAdmin.regionId
    }

    fun mayUpdateStoresInProject(user: AdministratorEntity, projectId: Int): Boolean =
        user.projectId.value == projectId && user.hasRole(Role.PROJECT_STORE_MANAGER)

    fun mayViewFreinetAgencyInformationInRegion(user: AdministratorEntity, regionId: Int): Boolean =
        user.hasRole(Role.REGION_ADMIN) && user.isInRegion(regionId) && user.isInProject(EAK_BAYERN_PROJECT)

    fun mayUpdateFreinetAgencyInformationInRegion(user: AdministratorEntity, regionId: Int): Boolean =
        user.hasRole(Role.REGION_ADMIN) && user.isInRegion(regionId) && user.isInProject(EAK_BAYERN_PROJECT)

    fun mayAddApiTokensInProject(user: AdministratorEntity): Boolean =
        transaction {
            (user.hasRole(Role.PROJECT_ADMIN) && user.isInProject(KOBLENZ_PASS_PROJECT)) ||
                (user.hasRole(Role.EXTERNAL_VERIFIED_API_USER) && user.isInProject(EAK_BAYERN_PROJECT))
        }

    fun mayViewApiMetadataInProject(user: AdministratorEntity): Boolean =
        user.hasRole(Role.PROJECT_ADMIN) || user.hasRole(Role.EXTERNAL_VERIFIED_API_USER)

    fun mayDeleteApiTokensInProject(user: AdministratorEntity): Boolean =
        user.hasRole(Role.PROJECT_ADMIN) || user.hasRole(Role.EXTERNAL_VERIFIED_API_USER)

    fun mayViewHashingPepper(user: AdministratorEntity): Boolean =
        transaction {
            user.isInProject(KOBLENZ_PASS_PROJECT) && user.hasRole(Role.PROJECT_ADMIN)
        }
}
