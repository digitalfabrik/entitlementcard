package app.ehrenamtskarte.backend.auth.service

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Role
import app.ehrenamtskarte.backend.common.webservice.EAK_BAYERN_PROJECT
import app.ehrenamtskarte.backend.common.webservice.KOBLENZ_PASS_PROJECT
import app.ehrenamtskarte.backend.regions.database.RegionEntity
import org.jetbrains.exposed.sql.transactions.transaction

object Authorizer {

    fun mayCreateCardInRegion(user: AdministratorEntity, regionId: Int): Boolean {
        return user.isRegion(regionId) && user.isRole(Role.REGION_MANAGER, Role.REGION_ADMIN)
    }

    fun mayDeleteCardInRegion(user: AdministratorEntity, regionId: Int): Boolean {
        return user.isRegion(regionId) && user.isRole(Role.REGION_MANAGER, Role.REGION_ADMIN)
    }

    fun mayViewApplicationsInRegion(user: AdministratorEntity, regionId: Int): Boolean {
        return user.isRegion(regionId) && user.isRole(Role.REGION_MANAGER, Role.REGION_ADMIN)
    }

    fun mayUpdateApplicationsInRegion(user: AdministratorEntity, regionId: Int): Boolean {
        return user.isRegion(regionId) && user.isRole(Role.REGION_MANAGER, Role.REGION_ADMIN)
    }

    fun mayDeleteApplicationsInRegion(user: AdministratorEntity, regionId: Int): Boolean {
        return user.isRegion(regionId) && user.isRole(Role.REGION_MANAGER, Role.REGION_ADMIN)
    }

    fun mayUpdateSettingsInRegion(user: AdministratorEntity, regionId: Int): Boolean {
        return user.isRegion(regionId) && user.isRole(Role.REGION_ADMIN)
    }

    fun mayViewUsersInProject(user: AdministratorEntity, projectId: Int): Boolean {
        return user.isProject(projectId) && user.isRole(Role.PROJECT_ADMIN)
    }

    fun mayViewUsersInRegion(user: AdministratorEntity, region: RegionEntity): Boolean {
        return mayViewUsersInProject(user, region.projectId.value) ||
            (user.isRole(Role.REGION_ADMIN) && user.isRegion(region.id.value))
    }

    fun maySendMailsInRegion(user: AdministratorEntity, regionId: Int): Boolean {
        return user.isRegion(regionId) && user.isRole(Role.REGION_MANAGER, Role.REGION_ADMIN)
    }

    fun mayViewCardStatisticsInProject(user: AdministratorEntity, projectId: Int): Boolean {
        return user.isProject(projectId) && user.isRole(Role.PROJECT_ADMIN)
    }

    fun mayViewCardStatisticsInRegion(user: AdministratorEntity, regionId: Int): Boolean {
        return user.isRole(Role.REGION_ADMIN) && user.isRegion(regionId)
    }

    fun mayCreateUser(
        actingAdmin: AdministratorEntity,
        newAdminProjectId: Int,
        newAdminRole: Role,
        newAdminRegion: RegionEntity?
    ): Boolean {
        if (actingAdmin.projectId.value != newAdminProjectId || newAdminRole == Role.NO_RIGHTS) {
            return false
        }
        if (actingAdmin.isRole(Role.PROJECT_ADMIN)) {
            return newAdminRole != Role.EXTERNAL_VERIFIED_API_USER || transaction {
                actingAdmin.isProject(
                    EAK_BAYERN_PROJECT
                )
            }
        }
        return actingAdmin.isRole(Role.REGION_ADMIN) &&
            newAdminRegion != null && actingAdmin.regionId == newAdminRegion.id &&
            newAdminRole in setOf(Role.REGION_ADMIN, Role.REGION_MANAGER)
    }

    fun mayEditUser(
        actingAdmin: AdministratorEntity,
        existingAdmin: AdministratorEntity,
        newAdminProjectId: Int,
        newAdminRole: Role,
        newAdminRegion: RegionEntity?
    ): Boolean {
        if (!actingAdmin.isProject(newAdminProjectId) || !existingAdmin.isProject(newAdminProjectId) || newAdminRole == Role.NO_RIGHTS) {
            return false
        }
        if (actingAdmin.isRole(Role.PROJECT_ADMIN)) {
            return newAdminRole != Role.EXTERNAL_VERIFIED_API_USER || transaction {
                actingAdmin.isProject(
                    EAK_BAYERN_PROJECT
                )
            }
        }
        return actingAdmin.isRole(Role.REGION_ADMIN) &&
            existingAdmin.regionId == actingAdmin.regionId &&
            newAdminRegion != null && actingAdmin.regionId == newAdminRegion.id &&
            newAdminRole in setOf(Role.REGION_ADMIN, Role.REGION_MANAGER)
    }

    fun mayDeleteUser(actingAdmin: AdministratorEntity, existingAdmin: AdministratorEntity): Boolean {
        if (actingAdmin.projectId != existingAdmin.projectId) {
            return false
        }
        if (actingAdmin.isRole(Role.PROJECT_ADMIN)) {
            return true
        }
        return actingAdmin.isRole(Role.REGION_ADMIN) && existingAdmin.regionId == actingAdmin.regionId
    }

    fun mayUpdateStoresInProject(user: AdministratorEntity, projectId: Int): Boolean {
        return user.projectId.value == projectId && user.isRole(Role.PROJECT_STORE_MANAGER)
    }

    fun mayViewFreinetAgencyInformationInRegion(user: AdministratorEntity, regionId: Int): Boolean {
        return user.isRole(Role.REGION_ADMIN) && user.isProject(EAK_BAYERN_PROJECT) && user.isRegion(regionId)
    }

    fun mayAddApiTokensInProject(user: AdministratorEntity): Boolean {
        return transaction {
            (user.isRole(Role.PROJECT_ADMIN) && user.isProject(KOBLENZ_PASS_PROJECT)) ||
                (user.isRole(Role.EXTERNAL_VERIFIED_API_USER) && user.isProject(EAK_BAYERN_PROJECT))
        }
    }

    fun mayViewApiMetadataInProject(user: AdministratorEntity): Boolean =
        user.isRole(Role.PROJECT_ADMIN) || user.isRole(Role.EXTERNAL_VERIFIED_API_USER)

    fun mayDeleteApiTokensInProject(user: AdministratorEntity): Boolean =
        user.isRole(Role.PROJECT_ADMIN) || user.isRole(Role.EXTERNAL_VERIFIED_API_USER)

    fun mayViewHashingPepper(user: AdministratorEntity): Boolean {
        return transaction { user.isProject(KOBLENZ_PASS_PROJECT) && user.isRole(Role.PROJECT_ADMIN) }
    }
}
