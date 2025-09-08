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
import kotlin.test.assertFalse
import kotlin.test.assertTrue

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
            assertTrue(bayernRegionAdmin.mayCreateCardInRegion(bayernRegionId))
            assertTrue(bayernRegionManager.mayCreateCardInRegion(bayernRegionId))
            assertTrue(koblenzRegionAdmin.mayCreateCardInRegion(koblenzRegionId))
            assertTrue(koblenzRegionManager.mayCreateCardInRegion(koblenzRegionId))

            assertFalse(bayernProjectAdmin.mayCreateCardInRegion(16))
            assertFalse(bayernRegionAdmin.mayCreateCardInRegion(5))
            assertFalse(bayernRegionManager.mayCreateCardInRegion(5))
            assertFalse(koblenzProjectAdmin.mayCreateCardInRegion(2))
            assertFalse(koblenzRegionManager.mayCreateCardInRegion(2))
            assertFalse(nuernbergStoreManager.mayCreateCardInRegion(5))
        }
    }

    @Test
    fun testMayDeleteCardInRegion() {
        transaction {
            assertTrue(bayernRegionAdmin.mayDeleteCardInRegion(bayernRegionId))
            assertTrue(bayernRegionManager.mayDeleteCardInRegion(bayernRegionId))
            assertTrue(koblenzRegionAdmin.mayDeleteCardInRegion(koblenzRegionId))
            assertTrue(koblenzRegionManager.mayDeleteCardInRegion(koblenzRegionId))

            assertFalse(bayernProjectAdmin.mayDeleteCardInRegion(16))
            assertFalse(bayernRegionAdmin.mayDeleteCardInRegion(5))
            assertFalse(bayernRegionManager.mayDeleteCardInRegion(5))
            assertFalse(koblenzProjectAdmin.mayDeleteCardInRegion(2))
            assertFalse(koblenzRegionManager.mayDeleteCardInRegion(2))
            assertFalse(nuernbergStoreManager.mayDeleteCardInRegion(5))
        }
    }

    @Test
    fun testMayViewApplicationsInRegion() {
        transaction {
            assertTrue(bayernRegionAdmin.mayViewApplicationsInRegion(bayernRegionId))
            assertTrue(bayernRegionManager.mayViewApplicationsInRegion(bayernRegionId))
            assertTrue(koblenzRegionAdmin.mayViewApplicationsInRegion(koblenzRegionId))
            assertTrue(koblenzRegionManager.mayViewApplicationsInRegion(koblenzRegionId))

            assertFalse(bayernProjectAdmin.mayViewApplicationsInRegion(16))
            assertFalse(bayernRegionAdmin.mayViewApplicationsInRegion(5))
            assertFalse(bayernRegionManager.mayViewApplicationsInRegion(5))
            assertFalse(koblenzProjectAdmin.mayViewApplicationsInRegion(2))
            assertFalse(koblenzRegionManager.mayViewApplicationsInRegion(2))
            assertFalse(nuernbergStoreManager.mayViewApplicationsInRegion(5))
        }
    }

    @Test
    fun testMayUpdateApplicationsInRegion() {
        transaction {
            assertTrue(bayernRegionAdmin.mayUpdateApplicationsInRegion(bayernRegionId))
            assertTrue(bayernRegionManager.mayUpdateApplicationsInRegion(bayernRegionId))
            assertTrue(koblenzRegionAdmin.mayUpdateApplicationsInRegion(koblenzRegionId))
            assertTrue(koblenzRegionManager.mayUpdateApplicationsInRegion(koblenzRegionId))

            assertFalse(bayernProjectAdmin.mayUpdateApplicationsInRegion(16))
            assertFalse(bayernRegionAdmin.mayUpdateApplicationsInRegion(5))
            assertFalse(bayernRegionManager.mayUpdateApplicationsInRegion(5))
            assertFalse(koblenzProjectAdmin.mayUpdateApplicationsInRegion(2))
            assertFalse(koblenzRegionManager.mayUpdateApplicationsInRegion(2))
            assertFalse(nuernbergStoreManager.mayUpdateApplicationsInRegion(5))
        }
    }

    @Test
    fun testMayDeleteApplicationsInRegion() {
        transaction {
            assertTrue(bayernRegionAdmin.mayDeleteApplicationsInRegion(bayernRegionId))
            assertTrue(bayernRegionManager.mayDeleteApplicationsInRegion(bayernRegionId))
            assertTrue(koblenzRegionAdmin.mayDeleteApplicationsInRegion(koblenzRegionId))
            assertTrue(koblenzRegionManager.mayDeleteApplicationsInRegion(koblenzRegionId))

            assertFalse(bayernProjectAdmin.mayDeleteApplicationsInRegion(16))
            assertFalse(bayernRegionAdmin.mayDeleteApplicationsInRegion(5))
            assertFalse(bayernRegionManager.mayDeleteApplicationsInRegion(5))
            assertFalse(koblenzProjectAdmin.mayDeleteApplicationsInRegion(2))
            assertFalse(koblenzRegionManager.mayDeleteApplicationsInRegion(2))
            assertFalse(nuernbergStoreManager.mayDeleteApplicationsInRegion(5))
        }
    }

    @Test
    fun testMayUpdateSettingsInRegion() {
        transaction {
            assertTrue(bayernRegionAdmin.mayUpdateSettingsInRegion(bayernRegionId))
            assertTrue(koblenzRegionAdmin.mayUpdateSettingsInRegion(koblenzRegionId))

            assertFalse(bayernProjectAdmin.mayUpdateSettingsInRegion(16))
            assertFalse(bayernRegionAdmin.mayUpdateSettingsInRegion(5))
            assertFalse(bayernRegionManager.mayUpdateSettingsInRegion(bayernRegionId))
            assertFalse(bayernRegionManager.mayUpdateSettingsInRegion(5))
            assertFalse(koblenzProjectAdmin.mayUpdateSettingsInRegion(2))
            assertFalse(koblenzRegionManager.mayUpdateSettingsInRegion(2))
            assertFalse(koblenzRegionManager.mayUpdateSettingsInRegion(koblenzRegionId))
            assertFalse(nuernbergStoreManager.mayUpdateSettingsInRegion(5))
        }
    }

    @Test
    fun testMayViewUsersInProject() {
        transaction {
            assertTrue(bayernProjectAdmin.mayViewUsersInProject(bayernId))
            assertTrue(koblenzProjectAdmin.mayViewUsersInProject(koblenzId))
            assertTrue(nuernbergProjectAdmin.mayViewUsersInProject(nuernbergId))

            assertFalse(bayernProjectAdmin.mayViewUsersInProject(10))
            assertFalse(bayernRegionAdmin.mayViewUsersInProject(bayernId))
            assertFalse(bayernRegionManager.mayViewUsersInProject(bayernId))
            assertFalse(koblenzProjectAdmin.mayViewUsersInProject(10))
            assertFalse(koblenzRegionManager.mayViewUsersInProject(koblenzId))
            assertFalse(koblenzRegionAdmin.mayViewUsersInProject(koblenzId))
            assertFalse(koblenzRegionManager.mayViewUsersInProject(koblenzId))
            assertFalse(nuernbergStoreManager.mayViewUsersInProject(nuernbergId))
        }
    }

    @Test
    fun testMayViewUsersInRegion() {
        transaction {
            assertTrue(bayernProjectAdmin.mayViewUsersInRegion(bayernRegion))
            assertTrue(bayernRegionAdmin.mayViewUsersInRegion(bayernRegion))
            assertTrue(koblenzProjectAdmin.mayViewUsersInRegion(koblenzRegionAdmin.region()))
            assertTrue(koblenzRegionAdmin.mayViewUsersInRegion(koblenzRegionAdmin.region()))

            assertFalse(bayernProjectAdmin.mayViewUsersInRegion(koblenzRegion))
            assertFalse(bayernRegionAdmin.mayViewUsersInRegion(koblenzRegionAdmin.region()))
            assertFalse(bayernRegionManager.mayViewUsersInRegion(bayernRegionManager.region()))
            assertFalse(koblenzProjectAdmin.mayViewUsersInRegion(bayernRegion))
            assertFalse(koblenzRegionAdmin.mayViewUsersInRegion(bayernRegion))
            assertFalse(koblenzRegionManager.mayViewUsersInRegion(koblenzRegion))
            assertFalse(nuernbergStoreManager.mayViewUsersInRegion(koblenzRegion))
        }
    }

    @Test
    fun testMaySendMailsInRegion() {
        transaction {
            assertTrue(bayernRegionAdmin.maySendMailsInRegion(bayernRegionId))
            assertTrue(bayernRegionManager.maySendMailsInRegion(bayernRegionId))
            assertTrue(koblenzRegionAdmin.maySendMailsInRegion(koblenzRegionId))
            assertTrue(koblenzRegionManager.maySendMailsInRegion(koblenzRegionId))

            assertFalse(bayernProjectAdmin.maySendMailsInRegion(16))
            assertFalse(bayernRegionAdmin.maySendMailsInRegion(5))
            assertFalse(bayernRegionManager.maySendMailsInRegion(5))
            assertFalse(koblenzProjectAdmin.maySendMailsInRegion(2))
            assertFalse(koblenzRegionManager.maySendMailsInRegion(2))
            assertFalse(nuernbergStoreManager.maySendMailsInRegion(5))
        }
    }

    @Test
    fun testMayCardStatisticsInProject() {
        transaction {
            assertTrue(bayernProjectAdmin.mayViewCardStatisticsInProject(bayernId))
            assertTrue(koblenzProjectAdmin.mayViewCardStatisticsInProject(koblenzId))
            assertTrue(nuernbergProjectAdmin.mayViewUsersInProject(nuernbergId))

            assertFalse(bayernProjectAdmin.mayViewCardStatisticsInProject(10))
            assertFalse(bayernRegionAdmin.mayViewCardStatisticsInProject(bayernId))
            assertFalse(bayernRegionManager.mayViewCardStatisticsInProject(bayernId))
            assertFalse(koblenzProjectAdmin.mayViewCardStatisticsInProject(10))
            assertFalse(koblenzRegionManager.mayViewCardStatisticsInProject(koblenzId))
            assertFalse(koblenzRegionAdmin.mayViewCardStatisticsInProject(koblenzId))
            assertFalse(koblenzRegionManager.mayViewCardStatisticsInProject(koblenzId))
            assertFalse(nuernbergStoreManager.mayViewCardStatisticsInProject(nuernbergId))
        }
    }

    @Test
    fun testMayViewCardStatisticsInRegion() {
        transaction {
            assertTrue(bayernRegionAdmin.mayViewCardStatisticsInRegion(bayernRegionId))
            assertTrue(koblenzRegionAdmin.mayViewCardStatisticsInRegion(koblenzRegionId))

            assertFalse(bayernProjectAdmin.mayViewCardStatisticsInRegion(16))
            assertFalse(bayernRegionAdmin.mayViewCardStatisticsInRegion(5))
            assertFalse(bayernRegionManager.mayViewCardStatisticsInRegion(bayernRegionId))
            assertFalse(bayernRegionManager.mayViewCardStatisticsInRegion(5))
            assertFalse(koblenzProjectAdmin.mayViewCardStatisticsInRegion(2))
            assertFalse(koblenzRegionManager.mayViewCardStatisticsInRegion(2))
            assertFalse(koblenzRegionManager.mayViewCardStatisticsInRegion(koblenzRegionId))
            assertFalse(nuernbergStoreManager.mayViewCardStatisticsInRegion(5))
        }
    }

    @Test
    fun testMayCreateUser() {
        transaction {
            assertTrue(bayernProjectAdmin.mayCreateUser(bayernId, Role.PROJECT_ADMIN, null))
            assertTrue(bayernProjectAdmin.mayCreateUser(bayernId, Role.REGION_ADMIN, bayernRegion))
            assertTrue(bayernProjectAdmin.mayCreateUser(bayernId, Role.REGION_MANAGER, bayernRegion))
            assertTrue(bayernProjectAdmin.mayCreateUser(bayernId, Role.EXTERNAL_VERIFIED_API_USER, null))
            assertFalse(bayernProjectAdmin.mayCreateUser(koblenzId, Role.REGION_ADMIN, bayernRegion))

            assertFalse(bayernProjectAdmin.mayCreateUser(bayernId, Role.NO_RIGHTS, bayernRegion))
            assertFalse(bayernRegionAdmin.mayCreateUser(bayernId, Role.PROJECT_ADMIN, null))
            assertTrue(bayernRegionAdmin.mayCreateUser(bayernId, Role.REGION_ADMIN, bayernRegion))
            assertFalse(bayernRegionAdmin.mayCreateUser(bayernId, Role.REGION_ADMIN, null))
            assertTrue(bayernRegionAdmin.mayCreateUser(bayernId, Role.REGION_MANAGER, bayernRegion))
            assertFalse(bayernRegionAdmin.mayCreateUser(bayernId, Role.REGION_MANAGER, null))
            assertFalse(bayernRegionAdmin.mayCreateUser(bayernId, Role.EXTERNAL_VERIFIED_API_USER, null))
            assertFalse(bayernRegionAdmin.mayCreateUser(koblenzId, Role.REGION_ADMIN, bayernRegion))
            assertFalse(bayernRegionAdmin.mayCreateUser(bayernId, Role.NO_RIGHTS, bayernRegion))

            assertFalse(bayernRegionManager.mayCreateUser(bayernId, Role.REGION_MANAGER, bayernRegion))
            assertFalse(bayernRegionManager.mayCreateUser(bayernId, Role.REGION_MANAGER, bayernRegion))
            assertFalse(bayernExternalUser.mayCreateUser(bayernId, Role.REGION_MANAGER, bayernRegion))

            assertTrue(koblenzProjectAdmin.mayCreateUser(koblenzId, Role.PROJECT_ADMIN, null))
            assertTrue(koblenzProjectAdmin.mayCreateUser(koblenzId, Role.REGION_ADMIN, koblenzRegion))
            assertTrue(koblenzProjectAdmin.mayCreateUser(koblenzId, Role.REGION_MANAGER, koblenzRegion))
            assertFalse(koblenzProjectAdmin.mayCreateUser(nuernbergId, Role.PROJECT_ADMIN, null))
            assertFalse(koblenzProjectAdmin.mayCreateUser(koblenzId, Role.NO_RIGHTS, null))
            assertFalse(koblenzProjectAdmin.mayCreateUser(koblenzId, Role.EXTERNAL_VERIFIED_API_USER, null))

            assertTrue(nuernbergProjectAdmin.mayCreateUser(nuernbergId, Role.PROJECT_ADMIN, null))
            assertFalse(nuernbergProjectAdmin.mayCreateUser(koblenzId, Role.PROJECT_ADMIN, null))
            assertFalse(nuernbergProjectAdmin.mayCreateUser(nuernbergId, Role.NO_RIGHTS, null))
            assertFalse(nuernbergProjectAdmin.mayCreateUser(nuernbergId, Role.EXTERNAL_VERIFIED_API_USER, null))
        }
    }

    @Test
    fun testMayEditUser() {
        transaction {
            assertTrue(bayernProjectAdmin.mayEditUser(bayernRegionAdmin, bayernId, Role.PROJECT_ADMIN, null))
            assertTrue(bayernProjectAdmin.mayEditUser(bayernProjectAdmin, bayernId, Role.REGION_ADMIN, bayernRegion))
            assertTrue(bayernProjectAdmin.mayEditUser(bayernProjectAdmin, bayernId, Role.REGION_MANAGER, bayernRegion))
            assertTrue(
                bayernProjectAdmin.mayEditUser(bayernProjectAdmin, bayernId, Role.EXTERNAL_VERIFIED_API_USER, null),
            )
            assertFalse(bayernProjectAdmin.mayEditUser(bayernProjectAdmin, koblenzId, Role.REGION_ADMIN, bayernRegion))
            assertFalse(bayernProjectAdmin.mayEditUser(koblenzProjectAdmin, koblenzId, Role.REGION_ADMIN, bayernRegion))
            assertFalse(bayernProjectAdmin.mayEditUser(bayernProjectAdmin, bayernId, Role.NO_RIGHTS, bayernRegion))
            assertFalse(bayernProjectAdmin.mayEditUser(bayernProjectAdmin, bayernId, Role.NO_RIGHTS, bayernRegion))

            assertFalse(bayernRegionAdmin.mayEditUser(bayernRegionManager, bayernId, Role.PROJECT_ADMIN, null))
            assertTrue(bayernRegionAdmin.mayEditUser(bayernRegionManager, bayernId, Role.REGION_ADMIN, bayernRegion))
            assertTrue(bayernRegionAdmin.mayEditUser(bayernRegionAdmin, bayernId, Role.REGION_MANAGER, bayernRegion))
            assertFalse(bayernRegionAdmin.mayEditUser(bayernProjectAdmin, koblenzId, Role.REGION_ADMIN, bayernRegion))
            assertFalse(bayernRegionAdmin.mayEditUser(koblenzProjectAdmin, koblenzId, Role.REGION_ADMIN, bayernRegion))
            assertFalse(bayernRegionAdmin.mayEditUser(bayernProjectAdmin, bayernId, Role.NO_RIGHTS, bayernRegion))
            assertFalse(bayernRegionAdmin.mayEditUser(bayernProjectAdmin, bayernId, Role.NO_RIGHTS, bayernRegion))

            assertFalse(bayernExternalUser.mayEditUser(bayernProjectAdmin, bayernId, Role.REGION_MANAGER, bayernRegion))
            assertFalse(bayernRegionManager.mayEditUser(bayernRegionAdmin, bayernId, Role.REGION_MANAGER, bayernRegion))
            assertFalse(
                bayernRegionManager.mayEditUser(bayernRegionManager, bayernId, Role.REGION_MANAGER, bayernRegion),
            )

            assertTrue(koblenzProjectAdmin.mayEditUser(koblenzProjectAdmin, koblenzId, Role.PROJECT_ADMIN, null))
            assertTrue(koblenzProjectAdmin.mayEditUser(koblenzRegionAdmin, koblenzId, Role.PROJECT_ADMIN, null))
            assertTrue(koblenzProjectAdmin.mayEditUser(koblenzRegionAdmin, koblenzId, Role.REGION_ADMIN, koblenzRegion))
            assertTrue(
                koblenzProjectAdmin.mayEditUser(koblenzRegionManager, koblenzId, Role.REGION_MANAGER, koblenzRegion),
            )
            assertFalse(
                koblenzProjectAdmin.mayEditUser(bayernRegionManager, koblenzId, Role.REGION_MANAGER, koblenzRegion),
            )
            assertFalse(koblenzProjectAdmin.mayEditUser(koblenzRegionAdmin, nuernbergId, Role.PROJECT_ADMIN, null))
            assertFalse(koblenzProjectAdmin.mayEditUser(koblenzRegionAdmin, koblenzId, Role.NO_RIGHTS, null))
            assertFalse(
                koblenzProjectAdmin.mayEditUser(koblenzRegionAdmin, koblenzId, Role.EXTERNAL_VERIFIED_API_USER, null),
            )

            assertTrue(nuernbergProjectAdmin.mayEditUser(nuernbergProjectAdmin, nuernbergId, Role.PROJECT_ADMIN, null))
            assertFalse(nuernbergProjectAdmin.mayEditUser(nuernbergProjectAdmin, koblenzId, Role.PROJECT_ADMIN, null))
            assertFalse(nuernbergProjectAdmin.mayEditUser(nuernbergProjectAdmin, nuernbergId, Role.NO_RIGHTS, null))
            assertFalse(
                nuernbergProjectAdmin.mayEditUser(
                    nuernbergProjectAdmin,
                    nuernbergId,
                    Role.EXTERNAL_VERIFIED_API_USER,
                    null,
                ),
            )
        }
    }

    @Test
    fun testMayDeleteUser() {
        transaction {
            assertTrue(bayernProjectAdmin.mayDeleteUser(bayernExternalUser))
            assertTrue(bayernProjectAdmin.mayDeleteUser(bayernProjectAdmin))
            assertTrue(bayernProjectAdmin.mayDeleteUser(bayernRegionAdmin))
            assertFalse(bayernProjectAdmin.mayDeleteUser(koblenzProjectAdmin))
            assertFalse(bayernProjectAdmin.mayDeleteUser(koblenzRegionManager))

            assertFalse(bayernRegionAdmin.mayDeleteUser(bayernProjectAdmin))
            assertTrue(bayernRegionAdmin.mayDeleteUser(bayernRegionAdmin))
            assertTrue(bayernRegionAdmin.mayDeleteUser(bayernRegionManager))
            assertFalse(bayernRegionAdmin.mayDeleteUser(koblenzRegionAdmin))
            assertFalse(bayernRegionAdmin.mayDeleteUser(nuernbergStoreManager))

            assertFalse(bayernRegionManager.mayDeleteUser(bayernRegionManager))
            assertFalse(bayernRegionManager.mayDeleteUser(bayernRegionAdmin))
            assertFalse(bayernExternalUser.mayDeleteUser(koblenzRegionManager))

            assertTrue(koblenzProjectAdmin.mayDeleteUser(koblenzProjectAdmin))
            assertTrue(koblenzProjectAdmin.mayDeleteUser(koblenzRegionAdmin))
            assertTrue(koblenzProjectAdmin.mayDeleteUser(koblenzRegionManager))
            assertFalse(koblenzProjectAdmin.mayDeleteUser(bayernProjectAdmin))
            assertFalse(koblenzProjectAdmin.mayDeleteUser(bayernRegionAdmin))

            assertTrue(nuernbergProjectAdmin.mayDeleteUser(nuernbergProjectAdmin))
            assertFalse(nuernbergProjectAdmin.mayDeleteUser(bayernRegionAdmin))
        }
    }

    @Test
    fun testMayViewFreinetAgencyInformationInRegion() {
        transaction {
            assertTrue(bayernRegionAdmin.mayViewFreinetAgencyInformationInRegion(bayernRegionId))
            assertFalse(bayernProjectAdmin.mayViewFreinetAgencyInformationInRegion(16))
            assertFalse(bayernRegionAdmin.mayViewFreinetAgencyInformationInRegion(5))
            assertFalse(bayernRegionManager.mayViewFreinetAgencyInformationInRegion(bayernRegionId))
            assertFalse(bayernRegionManager.mayViewFreinetAgencyInformationInRegion(5))
            assertFalse(koblenzProjectAdmin.mayViewFreinetAgencyInformationInRegion(2))
            assertFalse(koblenzRegionAdmin.mayViewFreinetAgencyInformationInRegion(koblenzRegionId))
            assertFalse(koblenzRegionManager.mayViewFreinetAgencyInformationInRegion(2))
            assertFalse(koblenzRegionManager.mayViewFreinetAgencyInformationInRegion(koblenzRegionId))
            assertFalse(nuernbergStoreManager.mayViewFreinetAgencyInformationInRegion(5))
        }
    }

    @Test
    fun testMayUpdateFreinetAgencyInformationInRegion() {
        transaction {
            assertTrue(bayernRegionAdmin.mayViewFreinetAgencyInformationInRegion(bayernRegionId))
            assertFalse(bayernProjectAdmin.mayViewFreinetAgencyInformationInRegion(16))
            assertFalse(bayernRegionAdmin.mayViewFreinetAgencyInformationInRegion(5))
            assertFalse(bayernRegionManager.mayViewFreinetAgencyInformationInRegion(bayernRegionId))
            assertFalse(bayernRegionManager.mayViewFreinetAgencyInformationInRegion(5))
            assertFalse(koblenzProjectAdmin.mayViewFreinetAgencyInformationInRegion(2))
            assertFalse(koblenzRegionAdmin.mayViewFreinetAgencyInformationInRegion(koblenzRegionId))
            assertFalse(koblenzRegionManager.mayViewFreinetAgencyInformationInRegion(2))
            assertFalse(koblenzRegionManager.mayViewFreinetAgencyInformationInRegion(koblenzRegionId))
            assertFalse(nuernbergStoreManager.mayViewFreinetAgencyInformationInRegion(5))
        }
    }

    @Test
    fun testMayAddApiTokensInProject() {
        transaction {
            assertTrue(bayernExternalUser.mayAddApiTokensInProject())
            assertTrue(koblenzProjectAdmin.mayAddApiTokensInProject())

            assertFalse(bayernProjectAdmin.mayAddApiTokensInProject())
            assertFalse(bayernRegionAdmin.mayAddApiTokensInProject())
            assertFalse(bayernRegionManager.mayAddApiTokensInProject())
            assertFalse(koblenzRegionManager.mayAddApiTokensInProject())
            assertFalse(koblenzRegionAdmin.mayAddApiTokensInProject())
            assertFalse(koblenzRegionManager.mayAddApiTokensInProject())
            assertFalse(nuernbergProjectAdmin.mayAddApiTokensInProject())
            assertFalse(nuernbergStoreManager.mayAddApiTokensInProject())
        }
    }

    @Test
    fun testMayViewApiMetadataInProject() {
        transaction {
            assertTrue(bayernProjectAdmin.mayViewApiMetadataInProject())
            assertTrue(bayernExternalUser.mayViewApiMetadataInProject())
            assertTrue(koblenzProjectAdmin.mayViewApiMetadataInProject())
            assertTrue(nuernbergProjectAdmin.mayViewApiMetadataInProject())

            assertFalse(bayernRegionAdmin.mayViewApiMetadataInProject())
            assertFalse(bayernRegionManager.mayViewApiMetadataInProject())
            assertFalse(koblenzRegionManager.mayViewApiMetadataInProject())
            assertFalse(koblenzRegionAdmin.mayViewApiMetadataInProject())
            assertFalse(koblenzRegionManager.mayViewApiMetadataInProject())
            assertFalse(nuernbergStoreManager.mayViewApiMetadataInProject())
        }
    }

    @Test
    fun testMayDeleteApiTokensInProject() {
        transaction {
            assertTrue(bayernProjectAdmin.mayDeleteApiTokensInProject())
            assertTrue(bayernExternalUser.mayDeleteApiTokensInProject())
            assertTrue(koblenzProjectAdmin.mayDeleteApiTokensInProject())
            assertTrue(nuernbergProjectAdmin.mayDeleteApiTokensInProject())

            assertFalse(bayernRegionAdmin.mayDeleteApiTokensInProject())
            assertFalse(bayernRegionManager.mayDeleteApiTokensInProject())
            assertFalse(koblenzRegionManager.mayDeleteApiTokensInProject())
            assertFalse(koblenzRegionAdmin.mayDeleteApiTokensInProject())
            assertFalse(koblenzRegionManager.mayDeleteApiTokensInProject())
            assertFalse(nuernbergStoreManager.mayDeleteApiTokensInProject())
        }
    }

    @Test
    fun testMayViewHashingPepper() {
        transaction {
            assertTrue(koblenzProjectAdmin.mayViewHashingPepper())

            assertFalse(bayernProjectAdmin.mayViewHashingPepper())
            assertFalse(bayernExternalUser.mayViewHashingPepper())
            assertFalse(bayernRegionAdmin.mayViewHashingPepper())
            assertFalse(bayernRegionManager.mayViewHashingPepper())
            assertFalse(koblenzRegionManager.mayViewHashingPepper())
            assertFalse(koblenzRegionAdmin.mayViewHashingPepper())
            assertFalse(koblenzRegionManager.mayViewHashingPepper())
            assertFalse(nuernbergProjectAdmin.mayViewHashingPepper())
            assertFalse(nuernbergStoreManager.mayViewHashingPepper())
        }
    }

    @Test
    fun testMayUpdateStoresInProject() {
        transaction {
            assertTrue(nuernbergStoreManager.mayUpdateStoresInProject(2))
            assertFalse(nuernbergProjectAdmin.mayUpdateStoresInProject(2))
        }
    }
}
