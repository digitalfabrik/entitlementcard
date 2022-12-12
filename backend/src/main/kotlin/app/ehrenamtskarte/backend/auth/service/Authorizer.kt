package app.ehrenamtskarte.backend.auth.service

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Role
import app.ehrenamtskarte.backend.regions.database.RegionEntity

object Authorizer {

    fun mayCreateCardInRegion(user: AdministratorEntity, regionId: Int): Boolean {
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

    fun mayDeleteApplicationsInRegion(user: AdministratorEntity, regionId: Int): Boolean {
        return user.regionId?.value == regionId && user.role in setOf(
            Role.REGION_MANAGER.db_value,
            Role.REGION_ADMIN.db_value
        )
    }

    fun mayViewUsersInProject(user: AdministratorEntity?, projectId: Int): Boolean {
        return user?.projectId?.value == projectId && user.role == Role.PROJECT_ADMIN.db_value
    }

    fun mayViewUsersInRegion(user: AdministratorEntity?, region: RegionEntity): Boolean {
        return (user?.role == Role.REGION_ADMIN.db_value && user.regionId == region.id) ||
            (user?.role == Role.PROJECT_ADMIN.db_value && user.projectId == region.projectId)
    }
}
