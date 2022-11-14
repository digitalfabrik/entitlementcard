package app.ehrenamtskarte.backend.auth.service

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Role

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
}
