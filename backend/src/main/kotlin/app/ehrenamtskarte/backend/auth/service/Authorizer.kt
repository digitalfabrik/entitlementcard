package app.ehrenamtskarte.backend.auth.service

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Role
import app.ehrenamtskarte.backend.common.webservice.EAK_BAYERN_PROJECT
import app.ehrenamtskarte.backend.common.webservice.KOBLENZ_PASS_PROJECT
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.regions.database.RegionEntity
import org.jetbrains.exposed.sql.transactions.transaction

object Authorizer {

    fun mayCreateCardInRegion(user: AdministratorEntity, regionId: Int): Boolean {
        return user.regionId?.value == regionId && user.role in setOf(
            Role.REGION_MANAGER.db_value,
            Role.REGION_ADMIN.db_value
        )
    }

    fun mayDeleteCardInRegion(user: AdministratorEntity, regionId: Int): Boolean {
        return user.regionId?.value == regionId && user.role in setOf(
            Role.REGION_MANAGER.db_value,
            Role.REGION_ADMIN.db_value
        )
    }

    fun mayViewApplicationsInRegion(user: AdministratorEntity, regionId: Int): Boolean {
        return user.regionId?.value == regionId && user.role in setOf(
            Role.REGION_MANAGER.db_value,
            Role.REGION_ADMIN.db_value
        )
    }

    fun mayUpdateApplicationsInRegion(user: AdministratorEntity, regionId: Int): Boolean {
        return user.regionId?.value == regionId && user.role in setOf(
            Role.REGION_MANAGER.db_value,
            Role.REGION_ADMIN.db_value
        )
    }

    fun mayDeleteApplicationsInRegion(user: AdministratorEntity, regionId: Int): Boolean {
        return user.regionId?.value == regionId && user.role in setOf(
            Role.REGION_MANAGER.db_value,
            Role.REGION_ADMIN.db_value
        )
    }

    fun mayUpdateSettingsInRegion(user: AdministratorEntity, regionId: Int): Boolean {
        return user.regionId?.value == regionId && user.role == Role.REGION_ADMIN.db_value
    }

    fun mayViewUsersInProject(user: AdministratorEntity?, projectId: Int): Boolean {
        return user?.projectId?.value == projectId && user.role == Role.PROJECT_ADMIN.db_value
    }

    fun mayViewUsersInRegion(user: AdministratorEntity?, region: RegionEntity): Boolean {
        return (user?.role == Role.REGION_ADMIN.db_value && user.regionId == region.id) ||
            mayViewUsersInProject(user, region.projectId.value)
    }

    fun maySendMailsInRegion(user: AdministratorEntity, regionId: Int): Boolean {
        return user.regionId?.value == regionId && user.role in setOf(
            Role.REGION_MANAGER.db_value,
            Role.REGION_ADMIN.db_value
        )
    }

    fun mayViewCardStatisticsInProject(user: AdministratorEntity?, projectId: Int): Boolean {
        return user?.projectId?.value == projectId && user.role == Role.PROJECT_ADMIN.db_value
    }

    fun mayViewCardStatisticsInRegion(user: AdministratorEntity?, region: RegionEntity): Boolean {
        return user?.role == Role.REGION_ADMIN.db_value && user.regionId == region.id
    }

    fun mayCreateUser(
        actingAdmin: AdministratorEntity,
        newAdminProjectId: Int,
        newAdminRole: Role,
        newAdminRegion: RegionEntity?
    ): Boolean {
        if (actingAdmin.projectId.value != newAdminProjectId) {
            return false
        } else if (newAdminRole == Role.NO_RIGHTS) {
            return false
        }

        if (actingAdmin.role == Role.PROJECT_ADMIN.db_value && newAdminRole == Role.EXTERNAL_VERIFIED_API_USER) {
            return transaction {
                ProjectEntity.find { Projects.project eq EAK_BAYERN_PROJECT }
                    .single().id.value == actingAdmin.projectId.value
            }
        }

        if (actingAdmin.role == Role.PROJECT_ADMIN.db_value) {
            return true
        } else if (
            actingAdmin.role == Role.REGION_ADMIN.db_value &&
            newAdminRegion != null && actingAdmin.regionId == newAdminRegion.id &&
            newAdminRole in setOf(Role.REGION_ADMIN, Role.REGION_MANAGER)
        ) {
            return true
        }

        return false
    }

    fun mayEditUser(
        actingAdmin: AdministratorEntity,
        existingAdmin: AdministratorEntity,
        newAdminProjectId: Int,
        newAdminRole: Role,
        newAdminRegion: RegionEntity?
    ): Boolean {
        if (actingAdmin.projectId.value != newAdminProjectId || existingAdmin.projectId.value != newAdminProjectId) {
            return false
        } else if (newAdminRole == Role.NO_RIGHTS) {
            return false
        }

        if (actingAdmin.role == Role.PROJECT_ADMIN.db_value) {
            return true
        } else if (
            actingAdmin.role == Role.REGION_ADMIN.db_value &&
            existingAdmin.regionId == actingAdmin.regionId &&
            newAdminRegion != null && actingAdmin.regionId == newAdminRegion.id &&
            newAdminRole in setOf(Role.REGION_ADMIN, Role.REGION_MANAGER)
        ) {
            return true
        }
        return false
    }

    fun mayDeleteUser(
        actingAdmin: AdministratorEntity,
        existingAdmin: AdministratorEntity
    ): Boolean {
        if (actingAdmin.projectId.value != existingAdmin.projectId.value && existingAdmin.role != Role.NO_RIGHTS.db_value) {
            return false
        }

        if (actingAdmin.role == Role.PROJECT_ADMIN.db_value) {
            return true
        } else if (actingAdmin.role == Role.REGION_ADMIN.db_value && existingAdmin.regionId == actingAdmin.regionId) {
            return true
        }
        return false
    }

    fun mayUpdateStoresInProject(user: AdministratorEntity, projectId: Int): Boolean {
        return user.projectId.value == projectId && user.role == Role.PROJECT_STORE_MANAGER.db_value
    }

    fun mayViewFreinetAgencyInformationInRegion(user: AdministratorEntity, regionId: Int): Boolean {
        return user.role == Role.REGION_ADMIN.db_value && ProjectEntity.find { Projects.project eq EAK_BAYERN_PROJECT }
            .single().id.value == user.projectId.value && user.regionId?.value == regionId
    }
    fun mayUpdateFreinetAgencyInformationInRegion(user: AdministratorEntity, regionId: Int): Boolean {
        return user.role == Role.REGION_ADMIN.db_value && ProjectEntity.find { Projects.project eq EAK_BAYERN_PROJECT }
            .single().id.value == user.projectId.value && user.regionId?.value == regionId
    }

    fun mayAddApiTokensInProject(user: AdministratorEntity): Boolean {
        return transaction {
            (
                user.role == Role.PROJECT_ADMIN.db_value && ProjectEntity.find { Projects.project eq KOBLENZ_PASS_PROJECT }
                    .single().id.value == user.projectId.value
                ) ||
                (
                    user.role == Role.EXTERNAL_VERIFIED_API_USER.db_value && ProjectEntity.find { Projects.project eq EAK_BAYERN_PROJECT }
                        .single().id.value == user.projectId.value
                    )
        }
    }

    fun mayViewApiMetadataInProject(user: AdministratorEntity): Boolean =
        user.role == Role.PROJECT_ADMIN.db_value || user.role == Role.EXTERNAL_VERIFIED_API_USER.db_value

    fun mayDeleteApiTokensInProject(user: AdministratorEntity): Boolean =
        user.role == Role.PROJECT_ADMIN.db_value || user.role == Role.EXTERNAL_VERIFIED_API_USER.db_value

    fun maySeeHashingPepper(user: AdministratorEntity): Boolean {
        return transaction {
            ProjectEntity.find { Projects.project eq KOBLENZ_PASS_PROJECT }
                .single().id.value == user.projectId.value &&
                user.role == Role.PROJECT_ADMIN.db_value
        }
    }
}
