package app.ehrenamtskarte.backend.auth.service

import app.ehrenamtskarte.backend.IntegrationTest
import app.ehrenamtskarte.backend.db.entities.AdministratorEntity
import app.ehrenamtskarte.backend.db.entities.Administrators
import app.ehrenamtskarte.backend.db.entities.RegionEntity
import app.ehrenamtskarte.backend.db.entities.mayAddApiTokensInProject
import app.ehrenamtskarte.backend.db.entities.mayCreateCardInRegion
import app.ehrenamtskarte.backend.db.entities.mayCreateUser
import app.ehrenamtskarte.backend.db.entities.mayDeleteApiTokensInProject
import app.ehrenamtskarte.backend.db.entities.mayDeleteApplicationsInRegion
import app.ehrenamtskarte.backend.db.entities.mayDeleteCardInRegion
import app.ehrenamtskarte.backend.db.entities.mayDeleteUser
import app.ehrenamtskarte.backend.db.entities.mayEditUser
import app.ehrenamtskarte.backend.db.entities.maySendMailsInRegion
import app.ehrenamtskarte.backend.db.entities.mayUpdateApplicationsInRegion
import app.ehrenamtskarte.backend.db.entities.mayUpdateSettingsInRegion
import app.ehrenamtskarte.backend.db.entities.mayUpdateStoresInProject
import app.ehrenamtskarte.backend.db.entities.mayViewApiMetadataInProject
import app.ehrenamtskarte.backend.db.entities.mayViewApplicationsInRegion
import app.ehrenamtskarte.backend.db.entities.mayViewCardStatisticsInProject
import app.ehrenamtskarte.backend.db.entities.mayViewCardStatisticsInRegion
import app.ehrenamtskarte.backend.db.entities.mayViewFreinetAgencyInformationInRegion
import app.ehrenamtskarte.backend.db.entities.mayViewHashingPepper
import app.ehrenamtskarte.backend.db.entities.mayViewUsersInProject
import app.ehrenamtskarte.backend.db.entities.mayViewUsersInRegion
import app.ehrenamtskarte.backend.graphql.auth.schema.types.Role
import app.ehrenamtskarte.backend.helper.TestAdministrators
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals

val bayernProjectAdmin = AdministratorEntity
    .find { Administrators.email eq TestAdministrators.EAK_PROJECT_ADMIN.email }
    .single()
val bayernRegionAdmin = AdministratorEntity
    .find { Administrators.email eq TestAdministrators.EAK_REGION_ADMIN.email }
    .single()
val bayernRegionManager = AdministratorEntity
    .find { Administrators.email eq TestAdministrators.EAK_REGION_MANAGER.email }
    .single()
val bayernExternalUser = AdministratorEntity
    .find { Administrators.email eq TestAdministrators.BAYERN_VEREIN_360.email }
    .single()
val nuernbergProjectAdmin = AdministratorEntity
    .find { Administrators.email eq TestAdministrators.NUERNBERG_PROJECT_ADMIN.email }
    .single()
val nuernbergStoreManager = AdministratorEntity
    .find { Administrators.email eq TestAdministrators.NUERNBERG_PROJECT_STORE_MANAGER.email }
    .single()
val koblenzProjectAdmin = AdministratorEntity
    .find { Administrators.email eq TestAdministrators.KOBLENZ_PROJECT_ADMIN.email }
    .single()
val koblenzRegionAdmin = AdministratorEntity
    .find { Administrators.email eq TestAdministrators.KOBLENZ_REGION_ADMIN.email }
    .single()
val koblenzRegionManager = AdministratorEntity
    .find { Administrators.email eq TestAdministrators.KOBLENZ_REGION_MANAGER.email }
    .single()
val bayernId = bayernProjectAdmin.projectId.value
val koblenzId = koblenzProjectAdmin.projectId.value
val nuernbergId = nuernbergProjectAdmin.projectId.value
val bayernRegion = RegionEntity.findById(bayernRegionAdmin.regionId!!)!!
val koblenzRegion = RegionEntity.findById(koblenzRegionAdmin.regionId!!)!!
val bayernRegionId = TestAdministrators.EAK_REGION_ADMIN.regionId!!
val koblenzRegionId = TestAdministrators.KOBLENZ_REGION_ADMIN.regionId!!

private fun AdministratorEntity.region() = RegionEntity.findById(this.regionId!!)!!

internal class AuthorizerTest : IntegrationTest() {
    @Test
    fun testMayCreateCardInRegion() {
        transaction {
            assertEquals(bayernRegionAdmin.mayCreateCardInRegion(bayernRegionId), true)
            assertEquals(bayernRegionManager.mayCreateCardInRegion(bayernRegionId), true)
            assertEquals(koblenzRegionAdmin.mayCreateCardInRegion(koblenzRegionId), true)
            assertEquals(koblenzRegionManager.mayCreateCardInRegion(koblenzRegionId), true)

            assertEquals(bayernProjectAdmin.mayCreateCardInRegion(16), false)
            assertEquals(bayernRegionAdmin.mayCreateCardInRegion(5), false)
            assertEquals(bayernRegionManager.mayCreateCardInRegion(5), false)
            assertEquals(koblenzProjectAdmin.mayCreateCardInRegion(2), false)
            assertEquals(koblenzRegionManager.mayCreateCardInRegion(2), false)
            assertEquals(nuernbergStoreManager.mayCreateCardInRegion(5), false)
        }
    }

    @Test
    fun testMayDeleteCardInRegion() {
        transaction {
            assertEquals(bayernRegionAdmin.mayDeleteCardInRegion(bayernRegionId), true)
            assertEquals(bayernRegionManager.mayDeleteCardInRegion(bayernRegionId), true)
            assertEquals(koblenzRegionAdmin.mayDeleteCardInRegion(koblenzRegionId), true)
            assertEquals(koblenzRegionManager.mayDeleteCardInRegion(koblenzRegionId), true)

            assertEquals(bayernProjectAdmin.mayDeleteCardInRegion(16), false)
            assertEquals(bayernRegionAdmin.mayDeleteCardInRegion(5), false)
            assertEquals(bayernRegionManager.mayDeleteCardInRegion(5), false)
            assertEquals(koblenzProjectAdmin.mayDeleteCardInRegion(2), false)
            assertEquals(koblenzRegionManager.mayDeleteCardInRegion(2), false)
            assertEquals(nuernbergStoreManager.mayDeleteCardInRegion(5), false)
        }
    }

    @Test
    fun testMayViewApplicationsInRegion() {
        transaction {
            assertEquals(bayernRegionAdmin.mayViewApplicationsInRegion(bayernRegionId), true)
            assertEquals(bayernRegionManager.mayViewApplicationsInRegion(bayernRegionId), true)
            assertEquals(koblenzRegionAdmin.mayViewApplicationsInRegion(koblenzRegionId), true)
            assertEquals(koblenzRegionManager.mayViewApplicationsInRegion(koblenzRegionId), true)

            assertEquals(bayernProjectAdmin.mayViewApplicationsInRegion(16), false)
            assertEquals(bayernRegionAdmin.mayViewApplicationsInRegion(5), false)
            assertEquals(bayernRegionManager.mayViewApplicationsInRegion(5), false)
            assertEquals(koblenzProjectAdmin.mayViewApplicationsInRegion(2), false)
            assertEquals(koblenzRegionManager.mayViewApplicationsInRegion(2), false)
            assertEquals(nuernbergStoreManager.mayViewApplicationsInRegion(5), false)
        }
    }

    @Test
    fun testMayUpdateApplicationsInRegion() {
        transaction {
            assertEquals(bayernRegionAdmin.mayUpdateApplicationsInRegion(bayernRegionId), true)
            assertEquals(bayernRegionManager.mayUpdateApplicationsInRegion(bayernRegionId), true)
            assertEquals(koblenzRegionAdmin.mayUpdateApplicationsInRegion(koblenzRegionId), true)
            assertEquals(koblenzRegionManager.mayUpdateApplicationsInRegion(koblenzRegionId), true)

            assertEquals(bayernProjectAdmin.mayUpdateApplicationsInRegion(16), false)
            assertEquals(bayernRegionAdmin.mayUpdateApplicationsInRegion(5), false)
            assertEquals(bayernRegionManager.mayUpdateApplicationsInRegion(5), false)
            assertEquals(koblenzProjectAdmin.mayUpdateApplicationsInRegion(2), false)
            assertEquals(koblenzRegionManager.mayUpdateApplicationsInRegion(2), false)
            assertEquals(nuernbergStoreManager.mayUpdateApplicationsInRegion(5), false)
        }
    }

    @Test
    fun testMayDeleteApplicationsInRegion() {
        transaction {
            assertEquals(bayernRegionAdmin.mayDeleteApplicationsInRegion(bayernRegionId), true)
            assertEquals(bayernRegionManager.mayDeleteApplicationsInRegion(bayernRegionId), true)
            assertEquals(koblenzRegionAdmin.mayDeleteApplicationsInRegion(koblenzRegionId), true)
            assertEquals(koblenzRegionManager.mayDeleteApplicationsInRegion(koblenzRegionId), true)

            assertEquals(bayernProjectAdmin.mayDeleteApplicationsInRegion(16), false)
            assertEquals(bayernRegionAdmin.mayDeleteApplicationsInRegion(5), false)
            assertEquals(bayernRegionManager.mayDeleteApplicationsInRegion(5), false)
            assertEquals(koblenzProjectAdmin.mayDeleteApplicationsInRegion(2), false)
            assertEquals(koblenzRegionManager.mayDeleteApplicationsInRegion(2), false)
            assertEquals(nuernbergStoreManager.mayDeleteApplicationsInRegion(5), false)
        }
    }

    @Test
    fun testMayUpdateSettingsInRegion() {
        transaction {
            assertEquals(bayernRegionAdmin.mayUpdateSettingsInRegion(bayernRegionId), true)
            assertEquals(koblenzRegionAdmin.mayUpdateSettingsInRegion(koblenzRegionId), true)

            assertEquals(bayernProjectAdmin.mayUpdateSettingsInRegion(16), false)
            assertEquals(bayernRegionAdmin.mayUpdateSettingsInRegion(5), false)
            assertEquals(bayernRegionManager.mayUpdateSettingsInRegion(bayernRegionId), false)
            assertEquals(bayernRegionManager.mayUpdateSettingsInRegion(5), false)
            assertEquals(koblenzProjectAdmin.mayUpdateSettingsInRegion(2), false)
            assertEquals(koblenzRegionManager.mayUpdateSettingsInRegion(2), false)
            assertEquals(koblenzRegionManager.mayUpdateSettingsInRegion(koblenzRegionId), false)
            assertEquals(nuernbergStoreManager.mayUpdateSettingsInRegion(5), false)
        }
    }

    @Test
    fun testMayViewUsersInProject() {
        transaction {
            assertEquals(bayernProjectAdmin.mayViewUsersInProject(bayernId), true)
            assertEquals(koblenzProjectAdmin.mayViewUsersInProject(koblenzId), true)
            assertEquals(nuernbergProjectAdmin.mayViewUsersInProject(nuernbergId), true)

            assertEquals(bayernProjectAdmin.mayViewUsersInProject(10), false)
            assertEquals(bayernRegionAdmin.mayViewUsersInProject(bayernId), false)
            assertEquals(bayernRegionManager.mayViewUsersInProject(bayernId), false)
            assertEquals(koblenzProjectAdmin.mayViewUsersInProject(10), false)
            assertEquals(koblenzRegionManager.mayViewUsersInProject(koblenzId), false)
            assertEquals(koblenzRegionAdmin.mayViewUsersInProject(koblenzId), false)
            assertEquals(koblenzRegionManager.mayViewUsersInProject(koblenzId), false)
            assertEquals(nuernbergStoreManager.mayViewUsersInProject(nuernbergId), false)
        }
    }

    @Test
    fun testMayViewUsersInRegion() {
        transaction {
            assertEquals(bayernProjectAdmin.mayViewUsersInRegion(bayernRegion), true)
            assertEquals(bayernRegionAdmin.mayViewUsersInRegion(bayernRegion), true)
            assertEquals(koblenzProjectAdmin.mayViewUsersInRegion(koblenzRegionAdmin.region()), true)
            assertEquals(koblenzRegionAdmin.mayViewUsersInRegion(koblenzRegionAdmin.region()), true)

            assertEquals(bayernProjectAdmin.mayViewUsersInRegion(koblenzRegion), false)
            assertEquals(bayernRegionAdmin.mayViewUsersInRegion(koblenzRegionAdmin.region()), false)
            assertEquals(bayernRegionManager.mayViewUsersInRegion(bayernRegionManager.region()), false)
            assertEquals(koblenzProjectAdmin.mayViewUsersInRegion(bayernRegion), false)
            assertEquals(koblenzRegionAdmin.mayViewUsersInRegion(bayernRegion), false)
            assertEquals(koblenzRegionManager.mayViewUsersInRegion(koblenzRegion), false)
            assertEquals(nuernbergStoreManager.mayViewUsersInRegion(koblenzRegion), false)
        }
    }

    @Test
    fun testMaySendMailsInRegion() {
        transaction {
            assertEquals(bayernRegionAdmin.maySendMailsInRegion(bayernRegionId), true)
            assertEquals(bayernRegionManager.maySendMailsInRegion(bayernRegionId), true)
            assertEquals(koblenzRegionAdmin.maySendMailsInRegion(koblenzRegionId), true)
            assertEquals(koblenzRegionManager.maySendMailsInRegion(koblenzRegionId), true)

            assertEquals(bayernProjectAdmin.maySendMailsInRegion(16), false)
            assertEquals(bayernRegionAdmin.maySendMailsInRegion(5), false)
            assertEquals(bayernRegionManager.maySendMailsInRegion(5), false)
            assertEquals(koblenzProjectAdmin.maySendMailsInRegion(2), false)
            assertEquals(koblenzRegionManager.maySendMailsInRegion(2), false)
            assertEquals(nuernbergStoreManager.maySendMailsInRegion(5), false)
        }
    }

    @Test
    fun testMayCardStatisticsInProject() {
        transaction {
            assertEquals(bayernProjectAdmin.mayViewCardStatisticsInProject(bayernId), true)
            assertEquals(koblenzProjectAdmin.mayViewCardStatisticsInProject(koblenzId), true)
            assertEquals(nuernbergProjectAdmin.mayViewUsersInProject(nuernbergId), true)

            assertEquals(bayernProjectAdmin.mayViewCardStatisticsInProject(10), false)
            assertEquals(bayernRegionAdmin.mayViewCardStatisticsInProject(bayernId), false)
            assertEquals(bayernRegionManager.mayViewCardStatisticsInProject(bayernId), false)
            assertEquals(koblenzProjectAdmin.mayViewCardStatisticsInProject(10), false)
            assertEquals(koblenzRegionManager.mayViewCardStatisticsInProject(koblenzId), false)
            assertEquals(koblenzRegionAdmin.mayViewCardStatisticsInProject(koblenzId), false)
            assertEquals(koblenzRegionManager.mayViewCardStatisticsInProject(koblenzId), false)
            assertEquals(nuernbergStoreManager.mayViewCardStatisticsInProject(nuernbergId), false)
        }
    }

    @Test
    fun testMayViewCardStatisticsInRegion() {
        transaction {
            assertEquals(bayernRegionAdmin.mayViewCardStatisticsInRegion(bayernRegionId), true)
            assertEquals(koblenzRegionAdmin.mayViewCardStatisticsInRegion(koblenzRegionId), true)

            assertEquals(bayernProjectAdmin.mayViewCardStatisticsInRegion(16), false)
            assertEquals(bayernRegionAdmin.mayViewCardStatisticsInRegion(5), false)
            assertEquals(bayernRegionManager.mayViewCardStatisticsInRegion(bayernRegionId), false)
            assertEquals(bayernRegionManager.mayViewCardStatisticsInRegion(5), false)
            assertEquals(koblenzProjectAdmin.mayViewCardStatisticsInRegion(2), false)
            assertEquals(koblenzRegionManager.mayViewCardStatisticsInRegion(2), false)
            assertEquals(koblenzRegionManager.mayViewCardStatisticsInRegion(koblenzRegionId), false)
            assertEquals(nuernbergStoreManager.mayViewCardStatisticsInRegion(5), false)
        }
    }

    @Test
    fun testMayCreateUser() {
        transaction {
            assertEquals(bayernProjectAdmin.mayCreateUser(bayernId, Role.PROJECT_ADMIN, null), true,)
            assertEquals(bayernProjectAdmin.mayCreateUser(bayernId, Role.REGION_ADMIN, bayernRegion), true)
            assertEquals(bayernProjectAdmin.mayCreateUser(bayernId, Role.REGION_MANAGER, bayernRegion), true)
            assertEquals(bayernProjectAdmin.mayCreateUser(bayernId, Role.EXTERNAL_VERIFIED_API_USER, null), true)
            assertEquals(bayernProjectAdmin.mayCreateUser(koblenzId, Role.REGION_ADMIN, bayernRegion), false)

            assertEquals(bayernProjectAdmin.mayCreateUser(bayernId, Role.NO_RIGHTS, bayernRegion), false)
            assertEquals(bayernRegionAdmin.mayCreateUser(bayernId, Role.PROJECT_ADMIN, null), false)
            assertEquals(bayernRegionAdmin.mayCreateUser(bayernId, Role.REGION_ADMIN, bayernRegion), true)
            assertEquals(bayernRegionAdmin.mayCreateUser(bayernId, Role.REGION_ADMIN, null), false)
            assertEquals(bayernRegionAdmin.mayCreateUser(bayernId, Role.REGION_MANAGER, bayernRegion), true)
            assertEquals(bayernRegionAdmin.mayCreateUser(bayernId, Role.REGION_MANAGER, null), false)
            assertEquals(bayernRegionAdmin.mayCreateUser(bayernId, Role.EXTERNAL_VERIFIED_API_USER, null), false)
            assertEquals(bayernRegionAdmin.mayCreateUser(koblenzId, Role.REGION_ADMIN, bayernRegion), false)
            assertEquals(bayernRegionAdmin.mayCreateUser(bayernId, Role.NO_RIGHTS, bayernRegion), false)

            assertEquals(bayernRegionManager.mayCreateUser(bayernId, Role.REGION_MANAGER, bayernRegion), false)
            assertEquals(bayernRegionManager.mayCreateUser(bayernId, Role.REGION_MANAGER, bayernRegion), false)
            assertEquals(bayernExternalUser.mayCreateUser(bayernId, Role.REGION_MANAGER, bayernRegion), false)

            assertEquals(koblenzProjectAdmin.mayCreateUser(koblenzId, Role.PROJECT_ADMIN, null), true)
            assertEquals(koblenzProjectAdmin.mayCreateUser(koblenzId, Role.REGION_ADMIN, koblenzRegion), true)
            assertEquals(koblenzProjectAdmin.mayCreateUser(koblenzId, Role.REGION_MANAGER, koblenzRegion), true)
            assertEquals(koblenzProjectAdmin.mayCreateUser(nuernbergId, Role.PROJECT_ADMIN, null), false)
            assertEquals(koblenzProjectAdmin.mayCreateUser(koblenzId, Role.NO_RIGHTS, null), false)
            assertEquals(koblenzProjectAdmin.mayCreateUser(koblenzId, Role.EXTERNAL_VERIFIED_API_USER, null), false)

            assertEquals(nuernbergProjectAdmin.mayCreateUser(nuernbergId, Role.PROJECT_ADMIN, null), true)
            assertEquals(nuernbergProjectAdmin.mayCreateUser(koblenzId, Role.PROJECT_ADMIN, null), false)
            assertEquals(nuernbergProjectAdmin.mayCreateUser(nuernbergId, Role.NO_RIGHTS, null), false)
            assertEquals(nuernbergProjectAdmin.mayCreateUser(nuernbergId, Role.EXTERNAL_VERIFIED_API_USER, null), false)
        }
    }

    @Test
    fun testMayEditUser() {
        transaction {
            assertEquals(
                bayernProjectAdmin.mayEditUser(bayernRegionAdmin, bayernId, Role.PROJECT_ADMIN, null),
                true,
            )
            assertEquals(
                bayernProjectAdmin.mayEditUser(bayernProjectAdmin, bayernId, Role.REGION_ADMIN, bayernRegion),
                true,
            )
            assertEquals(
                bayernProjectAdmin.mayEditUser(bayernProjectAdmin, bayernId, Role.REGION_MANAGER, bayernRegion),
                true,
            )
            assertEquals(
                bayernProjectAdmin.mayEditUser(bayernProjectAdmin, bayernId, Role.EXTERNAL_VERIFIED_API_USER, null),
                true,
            )
            assertEquals(
                bayernProjectAdmin.mayEditUser(bayernProjectAdmin, koblenzId, Role.REGION_ADMIN, bayernRegion),
                false,
            )
            assertEquals(
                bayernProjectAdmin.mayEditUser(koblenzProjectAdmin, koblenzId, Role.REGION_ADMIN, bayernRegion),
                false,
            )
            assertEquals(
                bayernProjectAdmin.mayEditUser( bayernProjectAdmin, bayernId, Role.NO_RIGHTS, bayernRegion),
                false,
            )
            assertEquals(
                bayernProjectAdmin.mayEditUser( bayernProjectAdmin, bayernId, Role.NO_RIGHTS, bayernRegion),
                false,
            )

            assertEquals(
                bayernRegionAdmin.mayEditUser(bayernRegionManager, bayernId, Role.PROJECT_ADMIN, null),
                false,
            )
            assertEquals(
                bayernRegionAdmin.mayEditUser(bayernRegionManager, bayernId, Role.REGION_ADMIN, bayernRegion),
                true,
            )
            assertEquals(
                bayernRegionAdmin.mayEditUser(bayernRegionAdmin, bayernId, Role.REGION_MANAGER, bayernRegion),
                true,
            )
            assertEquals(
                bayernRegionAdmin.mayEditUser(bayernProjectAdmin, koblenzId, Role.REGION_ADMIN, bayernRegion),
                false,
            )
            assertEquals(
                bayernRegionAdmin.mayEditUser(koblenzProjectAdmin, koblenzId, Role.REGION_ADMIN, bayernRegion),
                false,
            )
            assertEquals(
                bayernRegionAdmin.mayEditUser(bayernProjectAdmin, bayernId, Role.NO_RIGHTS, bayernRegion),
                false,
            )
            assertEquals(
                bayernRegionAdmin.mayEditUser(bayernProjectAdmin, bayernId, Role.NO_RIGHTS, bayernRegion),
                false,
            )

            assertEquals(
                bayernExternalUser.mayEditUser(bayernProjectAdmin, bayernId, Role.REGION_MANAGER, bayernRegion),
                false,
            )
            assertEquals(
                bayernRegionManager.mayEditUser(bayernRegionAdmin, bayernId, Role.REGION_MANAGER, bayernRegion),
                false,
            )
            assertEquals(
                bayernRegionManager.mayEditUser(bayernRegionManager, bayernId, Role.REGION_MANAGER, bayernRegion),
                false,
            )

            assertEquals(
                koblenzProjectAdmin.mayEditUser(koblenzProjectAdmin, koblenzId, Role.PROJECT_ADMIN, null),
                true,
            )
            assertEquals(
                koblenzProjectAdmin.mayEditUser(koblenzRegionAdmin, koblenzId, Role.PROJECT_ADMIN, null),
                true,
            )
            assertEquals(
                koblenzProjectAdmin.mayEditUser(koblenzRegionAdmin, koblenzId, Role.REGION_ADMIN, koblenzRegion),
                true,
            )
            assertEquals(
                koblenzProjectAdmin.mayEditUser(koblenzRegionManager, koblenzId, Role.REGION_MANAGER, koblenzRegion),
                true,
            )
            assertEquals(
                koblenzProjectAdmin.mayEditUser(bayernRegionManager, koblenzId, Role.REGION_MANAGER, koblenzRegion),
                false,
            )
            assertEquals(
                koblenzProjectAdmin.mayEditUser(koblenzRegionAdmin, nuernbergId, Role.PROJECT_ADMIN, null),
                false,
            )
            assertEquals(
                koblenzProjectAdmin.mayEditUser(koblenzRegionAdmin, koblenzId, Role.NO_RIGHTS, null),
                false,
            )
            assertEquals(
                koblenzProjectAdmin.mayEditUser(koblenzRegionAdmin, koblenzId, Role.EXTERNAL_VERIFIED_API_USER, null),
                false,
            )

            assertEquals(
                nuernbergProjectAdmin.mayEditUser(nuernbergProjectAdmin, nuernbergId, Role.PROJECT_ADMIN, null),
                true,
            )
            assertEquals(
                nuernbergProjectAdmin.mayEditUser(nuernbergProjectAdmin, koblenzId, Role.PROJECT_ADMIN, null),
                false,
            )
            assertEquals(
                nuernbergProjectAdmin.mayEditUser(nuernbergProjectAdmin, nuernbergId, Role.NO_RIGHTS, null),
                false,
            )
            assertEquals(
                nuernbergProjectAdmin.mayEditUser(nuernbergProjectAdmin, nuernbergId, Role.EXTERNAL_VERIFIED_API_USER, null),
                false,
            )
        }
    }

    @Test
    fun testMayDeleteUser() {
        transaction {
            assertEquals(bayernProjectAdmin.mayDeleteUser(bayernExternalUser), true)
            assertEquals(bayernProjectAdmin.mayDeleteUser(bayernProjectAdmin), true)
            assertEquals(bayernProjectAdmin.mayDeleteUser(bayernRegionAdmin), true)
            assertEquals(bayernProjectAdmin.mayDeleteUser(koblenzProjectAdmin), false)
            assertEquals(bayernProjectAdmin.mayDeleteUser(koblenzRegionManager), false)

            assertEquals(bayernRegionAdmin.mayDeleteUser(bayernProjectAdmin), false)
            assertEquals(bayernRegionAdmin.mayDeleteUser(bayernRegionAdmin), true)
            assertEquals(bayernRegionAdmin.mayDeleteUser(bayernRegionManager), true)
            assertEquals(bayernRegionAdmin.mayDeleteUser(koblenzRegionAdmin), false)
            assertEquals(bayernRegionAdmin.mayDeleteUser(nuernbergStoreManager), false)

            assertEquals(bayernRegionManager.mayDeleteUser(bayernRegionManager), false)
            assertEquals(bayernRegionManager.mayDeleteUser(bayernRegionAdmin), false)
            assertEquals(bayernExternalUser.mayDeleteUser(koblenzRegionManager), false)

            assertEquals(koblenzProjectAdmin.mayDeleteUser(koblenzProjectAdmin), true)
            assertEquals(koblenzProjectAdmin.mayDeleteUser(koblenzRegionAdmin), true)
            assertEquals(koblenzProjectAdmin.mayDeleteUser(koblenzRegionManager), true)
            assertEquals(koblenzProjectAdmin.mayDeleteUser(bayernProjectAdmin), false)
            assertEquals(koblenzProjectAdmin.mayDeleteUser(bayernRegionAdmin), false)

            assertEquals(nuernbergProjectAdmin.mayDeleteUser(nuernbergProjectAdmin), true)
            assertEquals(nuernbergProjectAdmin.mayDeleteUser(bayernRegionAdmin), false)
        }
    }

    @Test
    fun testMayViewFreinetAgencyInformationInRegion() {
        transaction {
            assertEquals(bayernRegionAdmin.mayViewFreinetAgencyInformationInRegion(bayernRegionId), true)
            assertEquals(bayernProjectAdmin.mayViewFreinetAgencyInformationInRegion(16), false)
            assertEquals(bayernRegionAdmin.mayViewFreinetAgencyInformationInRegion(5), false)
            assertEquals(bayernRegionManager.mayViewFreinetAgencyInformationInRegion(bayernRegionId), false)
            assertEquals(bayernRegionManager.mayViewFreinetAgencyInformationInRegion(5), false)
            assertEquals(koblenzProjectAdmin.mayViewFreinetAgencyInformationInRegion(2), false)
            assertEquals(koblenzRegionAdmin.mayViewFreinetAgencyInformationInRegion(koblenzRegionId), false)
            assertEquals(koblenzRegionManager.mayViewFreinetAgencyInformationInRegion(2), false)
            assertEquals(koblenzRegionManager.mayViewFreinetAgencyInformationInRegion(koblenzRegionId), false)
            assertEquals(nuernbergStoreManager.mayViewFreinetAgencyInformationInRegion(5), false)
        }
    }

    @Test
    fun testMayUpdateFreinetAgencyInformationInRegion() {
        transaction {
            assertEquals(bayernRegionAdmin.mayViewFreinetAgencyInformationInRegion(bayernRegionId), true)
            assertEquals(bayernProjectAdmin.mayViewFreinetAgencyInformationInRegion(16), false)
            assertEquals(bayernRegionAdmin.mayViewFreinetAgencyInformationInRegion(5), false)
            assertEquals(bayernRegionManager.mayViewFreinetAgencyInformationInRegion(bayernRegionId), false)
            assertEquals(bayernRegionManager.mayViewFreinetAgencyInformationInRegion(5), false)
            assertEquals(koblenzProjectAdmin.mayViewFreinetAgencyInformationInRegion(2), false)
            assertEquals(koblenzRegionAdmin.mayViewFreinetAgencyInformationInRegion(koblenzRegionId), false)
            assertEquals(koblenzRegionManager.mayViewFreinetAgencyInformationInRegion(2), false)
            assertEquals(koblenzRegionManager.mayViewFreinetAgencyInformationInRegion(koblenzRegionId), false)
            assertEquals(nuernbergStoreManager.mayViewFreinetAgencyInformationInRegion(5), false)
        }
    }

    @Test
    fun testMayAddApiTokensInProject() {
        transaction {
            assertEquals(bayernExternalUser.mayAddApiTokensInProject(), true)
            assertEquals(koblenzProjectAdmin.mayAddApiTokensInProject(), true)

            assertEquals(bayernProjectAdmin.mayAddApiTokensInProject(), false)
            assertEquals(bayernRegionAdmin.mayAddApiTokensInProject(), false)
            assertEquals(bayernRegionManager.mayAddApiTokensInProject(), false)
            assertEquals(koblenzRegionManager.mayAddApiTokensInProject(), false)
            assertEquals(koblenzRegionAdmin.mayAddApiTokensInProject(), false)
            assertEquals(koblenzRegionManager.mayAddApiTokensInProject(), false)
            assertEquals(nuernbergProjectAdmin.mayAddApiTokensInProject(), false)
            assertEquals(nuernbergStoreManager.mayAddApiTokensInProject(), false)
        }
    }

    @Test
    fun testMayViewApiMetadataInProject() {
        transaction {
            assertEquals(bayernProjectAdmin.mayViewApiMetadataInProject(), true)
            assertEquals(bayernExternalUser.mayViewApiMetadataInProject(), true)
            assertEquals(koblenzProjectAdmin.mayViewApiMetadataInProject(), true)
            assertEquals(nuernbergProjectAdmin.mayViewApiMetadataInProject(), true)

            assertEquals(bayernRegionAdmin.mayViewApiMetadataInProject(), false)
            assertEquals(bayernRegionManager.mayViewApiMetadataInProject(), false)
            assertEquals(koblenzRegionManager.mayViewApiMetadataInProject(), false)
            assertEquals(koblenzRegionAdmin.mayViewApiMetadataInProject(), false)
            assertEquals(koblenzRegionManager.mayViewApiMetadataInProject(), false)
            assertEquals(nuernbergStoreManager.mayViewApiMetadataInProject(), false)
        }
    }

    @Test
    fun testMayDeleteApiTokensInProject() {
        transaction {
            assertEquals(bayernProjectAdmin.mayDeleteApiTokensInProject(), true)
            assertEquals(bayernExternalUser.mayDeleteApiTokensInProject(), true)
            assertEquals(koblenzProjectAdmin.mayDeleteApiTokensInProject(), true)
            assertEquals(nuernbergProjectAdmin.mayDeleteApiTokensInProject(), true)

            assertEquals(bayernRegionAdmin.mayDeleteApiTokensInProject(), false)
            assertEquals(bayernRegionManager.mayDeleteApiTokensInProject(), false)
            assertEquals(koblenzRegionManager.mayDeleteApiTokensInProject(), false)
            assertEquals(koblenzRegionAdmin.mayDeleteApiTokensInProject(), false)
            assertEquals(koblenzRegionManager.mayDeleteApiTokensInProject(), false)
            assertEquals(nuernbergStoreManager.mayDeleteApiTokensInProject(), false)
        }
    }

    @Test
    fun testMayViewHashingPepper() {
        transaction {
            assertEquals(koblenzProjectAdmin.mayViewHashingPepper(), true)

            assertEquals(bayernProjectAdmin.mayViewHashingPepper(), false)
            assertEquals(bayernExternalUser.mayViewHashingPepper(), false)
            assertEquals(bayernRegionAdmin.mayViewHashingPepper(), false)
            assertEquals(bayernRegionManager.mayViewHashingPepper(), false)
            assertEquals(koblenzRegionManager.mayViewHashingPepper(), false)
            assertEquals(koblenzRegionAdmin.mayViewHashingPepper(), false)
            assertEquals(koblenzRegionManager.mayViewHashingPepper(), false)
            assertEquals(nuernbergProjectAdmin.mayViewHashingPepper(), false)
            assertEquals(nuernbergStoreManager.mayViewHashingPepper(), false)
        }
    }

    @Test
    fun testMayUpdateStoresInProject() {
        transaction {
            assertEquals(nuernbergStoreManager.mayUpdateStoresInProject(2), true)
            assertEquals(nuernbergProjectAdmin.mayUpdateStoresInProject(2), false)
        }
    }
}
