package app.ehrenamtskarte.backend.auth.service

import app.ehrenamtskarte.backend.IntegrationTest
import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.database.Administrators
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Role
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.regions.database.RegionEntity
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
            assertEquals(Authorizer.mayCreateCardInRegion(bayernRegionAdmin, bayernRegionId), true)
            assertEquals(Authorizer.mayCreateCardInRegion(bayernRegionManager, bayernRegionId), true)
            assertEquals(Authorizer.mayCreateCardInRegion(koblenzRegionAdmin, koblenzRegionId), true)
            assertEquals(Authorizer.mayCreateCardInRegion(koblenzRegionManager, koblenzRegionId), true)

            assertEquals(Authorizer.mayCreateCardInRegion(bayernProjectAdmin, 16), false)
            assertEquals(Authorizer.mayCreateCardInRegion(bayernRegionAdmin, 5), false)
            assertEquals(Authorizer.mayCreateCardInRegion(bayernRegionManager, 5), false)
            assertEquals(Authorizer.mayCreateCardInRegion(koblenzProjectAdmin, 2), false)
            assertEquals(Authorizer.mayCreateCardInRegion(koblenzRegionManager, 2), false)
            assertEquals(Authorizer.mayCreateCardInRegion(nuernbergStoreManager, 5), false)
        }
    }

    @Test
    fun testMayDeleteCardInRegion() {
        transaction {
            assertEquals(Authorizer.mayDeleteCardInRegion(bayernRegionAdmin, bayernRegionId), true)
            assertEquals(Authorizer.mayDeleteCardInRegion(bayernRegionManager, bayernRegionId), true)
            assertEquals(Authorizer.mayDeleteCardInRegion(koblenzRegionAdmin, koblenzRegionId), true)
            assertEquals(Authorizer.mayDeleteCardInRegion(koblenzRegionManager, koblenzRegionId), true)

            assertEquals(Authorizer.mayDeleteCardInRegion(bayernProjectAdmin, 16), false)
            assertEquals(Authorizer.mayDeleteCardInRegion(bayernRegionAdmin, 5), false)
            assertEquals(Authorizer.mayDeleteCardInRegion(bayernRegionManager, 5), false)
            assertEquals(Authorizer.mayDeleteCardInRegion(koblenzProjectAdmin, 2), false)
            assertEquals(Authorizer.mayDeleteCardInRegion(koblenzRegionManager, 2), false)
            assertEquals(Authorizer.mayDeleteCardInRegion(nuernbergStoreManager, 5), false)
        }
    }

    @Test
    fun testMayViewApplicationsInRegion() {
        transaction {
            assertEquals(Authorizer.mayViewApplicationsInRegion(bayernRegionAdmin, bayernRegionId), true)
            assertEquals(Authorizer.mayViewApplicationsInRegion(bayernRegionManager, bayernRegionId), true)
            assertEquals(Authorizer.mayViewApplicationsInRegion(koblenzRegionAdmin, koblenzRegionId), true)
            assertEquals(Authorizer.mayViewApplicationsInRegion(koblenzRegionManager, koblenzRegionId), true)

            assertEquals(Authorizer.mayViewApplicationsInRegion(bayernProjectAdmin, 16), false)
            assertEquals(Authorizer.mayViewApplicationsInRegion(bayernRegionAdmin, 5), false)
            assertEquals(Authorizer.mayViewApplicationsInRegion(bayernRegionManager, 5), false)
            assertEquals(Authorizer.mayViewApplicationsInRegion(koblenzProjectAdmin, 2), false)
            assertEquals(Authorizer.mayViewApplicationsInRegion(koblenzRegionManager, 2), false)
            assertEquals(Authorizer.mayViewApplicationsInRegion(nuernbergStoreManager, 5), false)
        }
    }

    @Test
    fun testMayUpdateApplicationsInRegion() {
        transaction {
            assertEquals(Authorizer.mayUpdateApplicationsInRegion(bayernRegionAdmin, bayernRegionId), true)
            assertEquals(Authorizer.mayUpdateApplicationsInRegion(bayernRegionManager, bayernRegionId), true)
            assertEquals(Authorizer.mayUpdateApplicationsInRegion(koblenzRegionAdmin, koblenzRegionId), true)
            assertEquals(Authorizer.mayUpdateApplicationsInRegion(koblenzRegionManager, koblenzRegionId), true)

            assertEquals(Authorizer.mayUpdateApplicationsInRegion(bayernProjectAdmin, 16), false)
            assertEquals(Authorizer.mayUpdateApplicationsInRegion(bayernRegionAdmin, 5), false)
            assertEquals(Authorizer.mayUpdateApplicationsInRegion(bayernRegionManager, 5), false)
            assertEquals(Authorizer.mayUpdateApplicationsInRegion(koblenzProjectAdmin, 2), false)
            assertEquals(Authorizer.mayUpdateApplicationsInRegion(koblenzRegionManager, 2), false)
            assertEquals(Authorizer.mayUpdateApplicationsInRegion(nuernbergStoreManager, 5), false)
        }
    }

    @Test
    fun testMayDeleteApplicationsInRegion() {
        transaction {
            assertEquals(Authorizer.mayDeleteApplicationsInRegion(bayernRegionAdmin, bayernRegionId), true)
            assertEquals(Authorizer.mayDeleteApplicationsInRegion(bayernRegionManager, bayernRegionId), true)
            assertEquals(Authorizer.mayDeleteApplicationsInRegion(koblenzRegionAdmin, koblenzRegionId), true)
            assertEquals(Authorizer.mayDeleteApplicationsInRegion(koblenzRegionManager, koblenzRegionId), true)

            assertEquals(Authorizer.mayDeleteApplicationsInRegion(bayernProjectAdmin, 16), false)
            assertEquals(Authorizer.mayDeleteApplicationsInRegion(bayernRegionAdmin, 5), false)
            assertEquals(Authorizer.mayDeleteApplicationsInRegion(bayernRegionManager, 5), false)
            assertEquals(Authorizer.mayDeleteApplicationsInRegion(koblenzProjectAdmin, 2), false)
            assertEquals(Authorizer.mayDeleteApplicationsInRegion(koblenzRegionManager, 2), false)
            assertEquals(Authorizer.mayDeleteApplicationsInRegion(nuernbergStoreManager, 5), false)
        }
    }

    @Test
    fun testMayUpdateSettingsInRegion() {
        transaction {
            assertEquals(Authorizer.mayUpdateSettingsInRegion(bayernRegionAdmin, bayernRegionId), true)
            assertEquals(Authorizer.mayUpdateSettingsInRegion(koblenzRegionAdmin, koblenzRegionId), true)

            assertEquals(Authorizer.mayUpdateSettingsInRegion(bayernProjectAdmin, 16), false)
            assertEquals(Authorizer.mayUpdateSettingsInRegion(bayernRegionAdmin, 5), false)
            assertEquals(Authorizer.mayUpdateSettingsInRegion(bayernRegionManager, bayernRegionId), false)
            assertEquals(Authorizer.mayUpdateSettingsInRegion(bayernRegionManager, 5), false)
            assertEquals(Authorizer.mayUpdateSettingsInRegion(koblenzProjectAdmin, 2), false)
            assertEquals(Authorizer.mayUpdateSettingsInRegion(koblenzRegionManager, 2), false)
            assertEquals(Authorizer.mayUpdateSettingsInRegion(koblenzRegionManager, koblenzRegionId), false)
            assertEquals(Authorizer.mayUpdateSettingsInRegion(nuernbergStoreManager, 5), false)
        }
    }

    @Test
    fun testMayViewUsersInProject() {
        transaction {
            assertEquals(Authorizer.mayViewUsersInProject(bayernProjectAdmin, bayernId), true)
            assertEquals(Authorizer.mayViewUsersInProject(koblenzProjectAdmin, koblenzId), true)
            assertEquals(Authorizer.mayViewUsersInProject(nuernbergProjectAdmin, nuernbergId), true)

            assertEquals(Authorizer.mayViewUsersInProject(bayernProjectAdmin, 10), false)
            assertEquals(Authorizer.mayViewUsersInProject(bayernRegionAdmin, bayernId), false)
            assertEquals(Authorizer.mayViewUsersInProject(bayernRegionManager, bayernId), false)
            assertEquals(Authorizer.mayViewUsersInProject(koblenzProjectAdmin, 10), false)
            assertEquals(Authorizer.mayViewUsersInProject(koblenzRegionManager, koblenzId), false)
            assertEquals(Authorizer.mayViewUsersInProject(koblenzRegionAdmin, koblenzId), false)
            assertEquals(Authorizer.mayViewUsersInProject(koblenzRegionManager, koblenzId), false)
            assertEquals(Authorizer.mayViewUsersInProject(nuernbergStoreManager, nuernbergId), false)
        }
    }

    @Test
    fun testMayViewUsersInRegion() {
        transaction {
            assertEquals(Authorizer.mayViewUsersInRegion(bayernProjectAdmin, bayernRegion), true)
            assertEquals(Authorizer.mayViewUsersInRegion(bayernRegionAdmin, bayernRegion), true)
            assertEquals(Authorizer.mayViewUsersInRegion(koblenzProjectAdmin, koblenzRegionAdmin.region()), true)
            assertEquals(Authorizer.mayViewUsersInRegion(koblenzRegionAdmin, koblenzRegionAdmin.region()), true)

            assertEquals(Authorizer.mayViewUsersInRegion(bayernProjectAdmin, koblenzRegion), false)
            assertEquals(Authorizer.mayViewUsersInRegion(bayernRegionAdmin, koblenzRegionAdmin.region()), false)
            assertEquals(Authorizer.mayViewUsersInRegion(bayernRegionManager, bayernRegionManager.region()), false)
            assertEquals(Authorizer.mayViewUsersInRegion(koblenzProjectAdmin, bayernRegion), false)
            assertEquals(Authorizer.mayViewUsersInRegion(koblenzRegionAdmin, bayernRegion), false)
            assertEquals(Authorizer.mayViewUsersInRegion(koblenzRegionManager, koblenzRegion), false)
            assertEquals(Authorizer.mayViewUsersInRegion(nuernbergStoreManager, koblenzRegion), false)
        }
    }

    @Test
    fun testMaySendMailsInRegion() {
        transaction {
            assertEquals(Authorizer.maySendMailsInRegion(bayernRegionAdmin, bayernRegionId), true)
            assertEquals(Authorizer.maySendMailsInRegion(bayernRegionManager, bayernRegionId), true)
            assertEquals(Authorizer.maySendMailsInRegion(koblenzRegionAdmin, koblenzRegionId), true)
            assertEquals(Authorizer.maySendMailsInRegion(koblenzRegionManager, koblenzRegionId), true)

            assertEquals(Authorizer.maySendMailsInRegion(bayernProjectAdmin, 16), false)
            assertEquals(Authorizer.maySendMailsInRegion(bayernRegionAdmin, 5), false)
            assertEquals(Authorizer.maySendMailsInRegion(bayernRegionManager, 5), false)
            assertEquals(Authorizer.maySendMailsInRegion(koblenzProjectAdmin, 2), false)
            assertEquals(Authorizer.maySendMailsInRegion(koblenzRegionManager, 2), false)
            assertEquals(Authorizer.maySendMailsInRegion(nuernbergStoreManager, 5), false)
        }
    }

    @Test
    fun testMayCardStatisticsInProject() {
        transaction {
            assertEquals(Authorizer.mayViewCardStatisticsInProject(bayernProjectAdmin, bayernId), true)
            assertEquals(Authorizer.mayViewCardStatisticsInProject(koblenzProjectAdmin, koblenzId), true)
            assertEquals(Authorizer.mayViewUsersInProject(nuernbergProjectAdmin, nuernbergId), true)

            assertEquals(Authorizer.mayViewCardStatisticsInProject(bayernProjectAdmin, 10), false)
            assertEquals(Authorizer.mayViewCardStatisticsInProject(bayernRegionAdmin, bayernId), false)
            assertEquals(Authorizer.mayViewCardStatisticsInProject(bayernRegionManager, bayernId), false)
            assertEquals(Authorizer.mayViewCardStatisticsInProject(koblenzProjectAdmin, 10), false)
            assertEquals(Authorizer.mayViewCardStatisticsInProject(koblenzRegionManager, koblenzId), false)
            assertEquals(Authorizer.mayViewCardStatisticsInProject(koblenzRegionAdmin, koblenzId), false)
            assertEquals(Authorizer.mayViewCardStatisticsInProject(koblenzRegionManager, koblenzId), false)
            assertEquals(Authorizer.mayViewCardStatisticsInProject(nuernbergStoreManager, nuernbergId), false)
        }
    }

    @Test
    fun testMayViewCardStatisticsInRegion() {
        transaction {
            assertEquals(Authorizer.mayViewCardStatisticsInRegion(bayernRegionAdmin, bayernRegionId), true)
            assertEquals(Authorizer.mayViewCardStatisticsInRegion(koblenzRegionAdmin, koblenzRegionId), true)

            assertEquals(Authorizer.mayViewCardStatisticsInRegion(bayernProjectAdmin, 16), false)
            assertEquals(Authorizer.mayViewCardStatisticsInRegion(bayernRegionAdmin, 5), false)
            assertEquals(Authorizer.mayViewCardStatisticsInRegion(bayernRegionManager, bayernRegionId), false)
            assertEquals(Authorizer.mayViewCardStatisticsInRegion(bayernRegionManager, 5), false)
            assertEquals(Authorizer.mayViewCardStatisticsInRegion(koblenzProjectAdmin, 2), false)
            assertEquals(Authorizer.mayViewCardStatisticsInRegion(koblenzRegionManager, 2), false)
            assertEquals(Authorizer.mayViewCardStatisticsInRegion(koblenzRegionManager, koblenzRegionId), false)
            assertEquals(Authorizer.mayViewCardStatisticsInRegion(nuernbergStoreManager, 5), false)
        }
    }

    @Test
    fun testMayCreateUser() {
        transaction {
            assertEquals(
                Authorizer.mayCreateUser(bayernProjectAdmin, bayernId, Role.PROJECT_ADMIN, null),
                true,
            )
            assertEquals(Authorizer.mayCreateUser(bayernProjectAdmin, bayernId, Role.REGION_ADMIN, bayernRegion), true)
            assertEquals(
                Authorizer.mayCreateUser(bayernProjectAdmin, bayernId, Role.REGION_MANAGER, bayernRegion),
                true,
            )
            assertEquals(
                Authorizer.mayCreateUser(bayernProjectAdmin, bayernId, Role.EXTERNAL_VERIFIED_API_USER, null),
                true,
            )
            assertEquals(
                Authorizer.mayCreateUser(bayernProjectAdmin, koblenzId, Role.REGION_ADMIN, bayernRegion),
                false,
            )
            assertEquals(Authorizer.mayCreateUser(bayernProjectAdmin, bayernId, Role.NO_RIGHTS, bayernRegion), false)

            assertEquals(Authorizer.mayCreateUser(bayernRegionAdmin, bayernId, Role.PROJECT_ADMIN, null), false)
            assertEquals(Authorizer.mayCreateUser(bayernRegionAdmin, bayernId, Role.REGION_ADMIN, bayernRegion), true)
            assertEquals(Authorizer.mayCreateUser(bayernRegionAdmin, bayernId, Role.REGION_ADMIN, null), false)
            assertEquals(Authorizer.mayCreateUser(bayernRegionAdmin, bayernId, Role.REGION_MANAGER, bayernRegion), true)
            assertEquals(Authorizer.mayCreateUser(bayernRegionAdmin, bayernId, Role.REGION_MANAGER, null), false)
            assertEquals(
                Authorizer.mayCreateUser(bayernRegionAdmin, bayernId, Role.EXTERNAL_VERIFIED_API_USER, null),
                false,
            )
            assertEquals(Authorizer.mayCreateUser(bayernRegionAdmin, koblenzId, Role.REGION_ADMIN, bayernRegion), false)
            assertEquals(Authorizer.mayCreateUser(bayernRegionAdmin, bayernId, Role.NO_RIGHTS, bayernRegion), false)

            assertEquals(
                Authorizer.mayCreateUser(bayernRegionManager, bayernId, Role.REGION_MANAGER, bayernRegion),
                false,
            )
            assertEquals(
                Authorizer.mayCreateUser(bayernRegionManager, bayernId, Role.REGION_MANAGER, bayernRegion),
                false,
            )
            assertEquals(
                Authorizer.mayCreateUser(bayernExternalUser, bayernId, Role.REGION_MANAGER, bayernRegion),
                false,
            )

            assertEquals(Authorizer.mayCreateUser(koblenzProjectAdmin, koblenzId, Role.PROJECT_ADMIN, null), true)
            assertEquals(
                Authorizer.mayCreateUser(koblenzProjectAdmin, koblenzId, Role.REGION_ADMIN, koblenzRegion),
                true,
            )
            assertEquals(
                Authorizer.mayCreateUser(koblenzProjectAdmin, koblenzId, Role.REGION_MANAGER, koblenzRegion),
                true,
            )
            assertEquals(Authorizer.mayCreateUser(koblenzProjectAdmin, nuernbergId, Role.PROJECT_ADMIN, null), false)
            assertEquals(Authorizer.mayCreateUser(koblenzProjectAdmin, koblenzId, Role.NO_RIGHTS, null), false)
            assertEquals(
                Authorizer.mayCreateUser(koblenzProjectAdmin, koblenzId, Role.EXTERNAL_VERIFIED_API_USER, null),
                false,
            )

            assertEquals(Authorizer.mayCreateUser(nuernbergProjectAdmin, nuernbergId, Role.PROJECT_ADMIN, null), true)
            assertEquals(Authorizer.mayCreateUser(nuernbergProjectAdmin, koblenzId, Role.PROJECT_ADMIN, null), false)
            assertEquals(Authorizer.mayCreateUser(nuernbergProjectAdmin, nuernbergId, Role.NO_RIGHTS, null), false)
            assertEquals(
                Authorizer.mayCreateUser(nuernbergProjectAdmin, nuernbergId, Role.EXTERNAL_VERIFIED_API_USER, null),
                false,
            )
        }
    }

    @Test
    fun testMayEditUser() {
        transaction {
            assertEquals(
                Authorizer.mayEditUser(bayernProjectAdmin, bayernRegionAdmin, bayernId, Role.PROJECT_ADMIN, null),
                true,
            )
            assertEquals(
                Authorizer.mayEditUser(
                    bayernProjectAdmin,
                    bayernProjectAdmin,
                    bayernId,
                    Role.REGION_ADMIN,
                    bayernRegion,
                ),
                true,
            )
            assertEquals(
                Authorizer.mayEditUser(
                    bayernProjectAdmin,
                    bayernProjectAdmin,
                    bayernId,
                    Role.REGION_MANAGER,
                    bayernRegion,
                ),
                true,
            )
            assertEquals(
                Authorizer.mayEditUser(
                    bayernProjectAdmin,
                    bayernProjectAdmin,
                    bayernId,
                    Role.EXTERNAL_VERIFIED_API_USER,
                    null,
                ),
                true,
            )
            assertEquals(
                Authorizer.mayEditUser(
                    bayernProjectAdmin,
                    bayernProjectAdmin,
                    koblenzId,
                    Role.REGION_ADMIN,
                    bayernRegion,
                ),
                false,
            )
            assertEquals(
                Authorizer.mayEditUser(
                    bayernProjectAdmin,
                    koblenzProjectAdmin,
                    koblenzId,
                    Role.REGION_ADMIN,
                    bayernRegion,
                ),
                false,
            )
            assertEquals(
                Authorizer.mayEditUser(bayernProjectAdmin, bayernProjectAdmin, bayernId, Role.NO_RIGHTS, bayernRegion),
                false,
            )
            assertEquals(
                Authorizer.mayEditUser(bayernProjectAdmin, bayernProjectAdmin, bayernId, Role.NO_RIGHTS, bayernRegion),
                false,
            )

            assertEquals(
                Authorizer.mayEditUser(bayernRegionAdmin, bayernRegionManager, bayernId, Role.PROJECT_ADMIN, null),
                false,
            )
            assertEquals(
                Authorizer.mayEditUser(
                    bayernRegionAdmin,
                    bayernRegionManager,
                    bayernId,
                    Role.REGION_ADMIN,
                    bayernRegion,
                ),
                true,
            )
            assertEquals(
                Authorizer.mayEditUser(
                    bayernRegionAdmin,
                    bayernRegionAdmin,
                    bayernId,
                    Role.REGION_MANAGER,
                    bayernRegion,
                ),
                true,
            )
            assertEquals(
                Authorizer.mayEditUser(
                    bayernRegionAdmin,
                    bayernProjectAdmin,
                    koblenzId,
                    Role.REGION_ADMIN,
                    bayernRegion,
                ),
                false,
            )
            assertEquals(
                Authorizer.mayEditUser(
                    bayernRegionAdmin,
                    koblenzProjectAdmin,
                    koblenzId,
                    Role.REGION_ADMIN,
                    bayernRegion,
                ),
                false,
            )
            assertEquals(
                Authorizer.mayEditUser(bayernRegionAdmin, bayernProjectAdmin, bayernId, Role.NO_RIGHTS, bayernRegion),
                false,
            )
            assertEquals(
                Authorizer.mayEditUser(bayernRegionAdmin, bayernProjectAdmin, bayernId, Role.NO_RIGHTS, bayernRegion),
                false,
            )

            assertEquals(
                Authorizer.mayEditUser(
                    bayernExternalUser,
                    bayernProjectAdmin,
                    bayernId,
                    Role.REGION_MANAGER,
                    bayernRegion,
                ),
                false,
            )
            assertEquals(
                Authorizer.mayEditUser(
                    bayernRegionManager,
                    bayernRegionAdmin,
                    bayernId,
                    Role.REGION_MANAGER,
                    bayernRegion,
                ),
                false,
            )
            assertEquals(
                Authorizer.mayEditUser(
                    bayernRegionManager,
                    bayernRegionManager,
                    bayernId,
                    Role.REGION_MANAGER,
                    bayernRegion,
                ),
                false,
            )

            assertEquals(
                Authorizer.mayEditUser(koblenzProjectAdmin, koblenzProjectAdmin, koblenzId, Role.PROJECT_ADMIN, null),
                true,
            )
            assertEquals(
                Authorizer.mayEditUser(koblenzProjectAdmin, koblenzRegionAdmin, koblenzId, Role.PROJECT_ADMIN, null),
                true,
            )
            assertEquals(
                Authorizer.mayEditUser(
                    koblenzProjectAdmin,
                    koblenzRegionAdmin,
                    koblenzId,
                    Role.REGION_ADMIN,
                    koblenzRegion,
                ),
                true,
            )
            assertEquals(
                Authorizer.mayEditUser(
                    koblenzProjectAdmin,
                    koblenzRegionManager,
                    koblenzId,
                    Role.REGION_MANAGER,
                    koblenzRegion,
                ),
                true,
            )
            assertEquals(
                Authorizer.mayEditUser(
                    koblenzProjectAdmin,
                    bayernRegionManager,
                    koblenzId,
                    Role.REGION_MANAGER,
                    koblenzRegion,
                ),
                false,
            )
            assertEquals(
                Authorizer.mayEditUser(koblenzProjectAdmin, koblenzRegionAdmin, nuernbergId, Role.PROJECT_ADMIN, null),
                false,
            )
            assertEquals(
                Authorizer.mayEditUser(koblenzProjectAdmin, koblenzRegionAdmin, koblenzId, Role.NO_RIGHTS, null),
                false,
            )
            assertEquals(
                Authorizer.mayEditUser(
                    koblenzProjectAdmin,
                    koblenzRegionAdmin,
                    koblenzId,
                    Role.EXTERNAL_VERIFIED_API_USER,
                    null,
                ),
                false,
            )

            assertEquals(
                Authorizer.mayEditUser(
                    nuernbergProjectAdmin,
                    nuernbergProjectAdmin,
                    nuernbergId,
                    Role.PROJECT_ADMIN,
                    null,
                ),
                true,
            )
            assertEquals(
                Authorizer.mayEditUser(
                    nuernbergProjectAdmin,
                    nuernbergProjectAdmin,
                    koblenzId,
                    Role.PROJECT_ADMIN,
                    null,
                ),
                false,
            )
            assertEquals(
                Authorizer.mayEditUser(nuernbergProjectAdmin, nuernbergProjectAdmin, nuernbergId, Role.NO_RIGHTS, null),
                false,
            )
            assertEquals(
                Authorizer.mayEditUser(
                    nuernbergProjectAdmin,
                    nuernbergProjectAdmin,
                    nuernbergId,
                    Role.EXTERNAL_VERIFIED_API_USER,
                    null,
                ),
                false,
            )
        }
    }

    @Test
    fun testMayDeleteUser() {
        transaction {
            assertEquals(Authorizer.mayDeleteUser(bayernProjectAdmin, bayernExternalUser), true)
            assertEquals(Authorizer.mayDeleteUser(bayernProjectAdmin, bayernProjectAdmin), true)
            assertEquals(Authorizer.mayDeleteUser(bayernProjectAdmin, bayernRegionAdmin), true)
            assertEquals(Authorizer.mayDeleteUser(bayernProjectAdmin, koblenzProjectAdmin), false)
            assertEquals(Authorizer.mayDeleteUser(bayernProjectAdmin, koblenzRegionManager), false)

            assertEquals(Authorizer.mayDeleteUser(bayernRegionAdmin, bayernProjectAdmin), false)
            assertEquals(Authorizer.mayDeleteUser(bayernRegionAdmin, bayernRegionAdmin), true)
            assertEquals(Authorizer.mayDeleteUser(bayernRegionAdmin, bayernRegionManager), true)
            assertEquals(Authorizer.mayDeleteUser(bayernRegionAdmin, koblenzRegionAdmin), false)
            assertEquals(Authorizer.mayDeleteUser(bayernRegionAdmin, nuernbergStoreManager), false)

            assertEquals(Authorizer.mayDeleteUser(bayernRegionManager, bayernRegionManager), false)
            assertEquals(Authorizer.mayDeleteUser(bayernRegionManager, bayernRegionAdmin), false)
            assertEquals(Authorizer.mayDeleteUser(bayernExternalUser, koblenzRegionManager), false)

            assertEquals(Authorizer.mayDeleteUser(koblenzProjectAdmin, koblenzProjectAdmin), true)
            assertEquals(Authorizer.mayDeleteUser(koblenzProjectAdmin, koblenzRegionAdmin), true)
            assertEquals(Authorizer.mayDeleteUser(koblenzProjectAdmin, koblenzRegionManager), true)
            assertEquals(Authorizer.mayDeleteUser(koblenzProjectAdmin, bayernProjectAdmin), false)
            assertEquals(Authorizer.mayDeleteUser(koblenzProjectAdmin, bayernRegionAdmin), false)

            assertEquals(Authorizer.mayDeleteUser(nuernbergProjectAdmin, nuernbergProjectAdmin), true)
            assertEquals(Authorizer.mayDeleteUser(nuernbergProjectAdmin, bayernRegionAdmin), false)
        }
    }

    @Test
    fun testMayViewFreinetAgencyInformationInRegion() {
        transaction {
            assertEquals(Authorizer.mayViewFreinetAgencyInformationInRegion(bayernRegionAdmin, bayernRegionId), true)
            assertEquals(Authorizer.mayViewFreinetAgencyInformationInRegion(bayernProjectAdmin, 16), false)
            assertEquals(Authorizer.mayViewFreinetAgencyInformationInRegion(bayernRegionAdmin, 5), false)
            assertEquals(Authorizer.mayViewFreinetAgencyInformationInRegion(bayernRegionManager, bayernRegionId), false)
            assertEquals(Authorizer.mayViewFreinetAgencyInformationInRegion(bayernRegionManager, 5), false)
            assertEquals(Authorizer.mayViewFreinetAgencyInformationInRegion(koblenzProjectAdmin, 2), false)
            assertEquals(Authorizer.mayViewFreinetAgencyInformationInRegion(koblenzRegionAdmin, koblenzRegionId), false)
            assertEquals(Authorizer.mayViewFreinetAgencyInformationInRegion(koblenzRegionManager, 2), false)
            assertEquals(
                Authorizer.mayViewFreinetAgencyInformationInRegion(koblenzRegionManager, koblenzRegionId),
                false,
            )
            assertEquals(Authorizer.mayViewFreinetAgencyInformationInRegion(nuernbergStoreManager, 5), false)
        }
    }

    @Test
    fun testMayUpdateFreinetAgencyInformationInRegion() {
        transaction {
            assertEquals(Authorizer.mayViewFreinetAgencyInformationInRegion(bayernRegionAdmin, bayernRegionId), true)
            assertEquals(Authorizer.mayViewFreinetAgencyInformationInRegion(bayernProjectAdmin, 16), false)
            assertEquals(Authorizer.mayViewFreinetAgencyInformationInRegion(bayernRegionAdmin, 5), false)
            assertEquals(Authorizer.mayViewFreinetAgencyInformationInRegion(bayernRegionManager, bayernRegionId), false)
            assertEquals(Authorizer.mayViewFreinetAgencyInformationInRegion(bayernRegionManager, 5), false)
            assertEquals(Authorizer.mayViewFreinetAgencyInformationInRegion(koblenzProjectAdmin, 2), false)
            assertEquals(Authorizer.mayViewFreinetAgencyInformationInRegion(koblenzRegionAdmin, koblenzRegionId), false)
            assertEquals(Authorizer.mayViewFreinetAgencyInformationInRegion(koblenzRegionManager, 2), false)
            assertEquals(
                Authorizer.mayViewFreinetAgencyInformationInRegion(koblenzRegionManager, koblenzRegionId),
                false,
            )
            assertEquals(Authorizer.mayViewFreinetAgencyInformationInRegion(nuernbergStoreManager, 5), false)
        }
    }

    @Test
    fun testMayAddApiTokensInProject() {
        transaction {
            assertEquals(Authorizer.mayAddApiTokensInProject(bayernExternalUser), true)
            assertEquals(Authorizer.mayAddApiTokensInProject(koblenzProjectAdmin), true)

            assertEquals(Authorizer.mayAddApiTokensInProject(bayernProjectAdmin), false)
            assertEquals(Authorizer.mayAddApiTokensInProject(bayernRegionAdmin), false)
            assertEquals(Authorizer.mayAddApiTokensInProject(bayernRegionManager), false)
            assertEquals(Authorizer.mayAddApiTokensInProject(koblenzRegionManager), false)
            assertEquals(Authorizer.mayAddApiTokensInProject(koblenzRegionAdmin), false)
            assertEquals(Authorizer.mayAddApiTokensInProject(koblenzRegionManager), false)
            assertEquals(Authorizer.mayAddApiTokensInProject(nuernbergProjectAdmin), false)
            assertEquals(Authorizer.mayAddApiTokensInProject(nuernbergStoreManager), false)
        }
    }

    @Test
    fun testMayViewApiMetadataInProject() {
        transaction {
            assertEquals(Authorizer.mayViewApiMetadataInProject(bayernProjectAdmin), true)
            assertEquals(Authorizer.mayViewApiMetadataInProject(bayernExternalUser), true)
            assertEquals(Authorizer.mayViewApiMetadataInProject(koblenzProjectAdmin), true)
            assertEquals(Authorizer.mayViewApiMetadataInProject(nuernbergProjectAdmin), true)

            assertEquals(Authorizer.mayViewApiMetadataInProject(bayernRegionAdmin), false)
            assertEquals(Authorizer.mayViewApiMetadataInProject(bayernRegionManager), false)
            assertEquals(Authorizer.mayViewApiMetadataInProject(koblenzRegionManager), false)
            assertEquals(Authorizer.mayViewApiMetadataInProject(koblenzRegionAdmin), false)
            assertEquals(Authorizer.mayViewApiMetadataInProject(koblenzRegionManager), false)
            assertEquals(Authorizer.mayViewApiMetadataInProject(nuernbergStoreManager), false)
        }
    }

    @Test
    fun testMayDeleteApiTokensInProject() {
        transaction {
            assertEquals(Authorizer.mayDeleteApiTokensInProject(bayernProjectAdmin), true)
            assertEquals(Authorizer.mayDeleteApiTokensInProject(bayernExternalUser), true)
            assertEquals(Authorizer.mayDeleteApiTokensInProject(koblenzProjectAdmin), true)
            assertEquals(Authorizer.mayDeleteApiTokensInProject(nuernbergProjectAdmin), true)

            assertEquals(Authorizer.mayDeleteApiTokensInProject(bayernRegionAdmin), false)
            assertEquals(Authorizer.mayDeleteApiTokensInProject(bayernRegionManager), false)
            assertEquals(Authorizer.mayDeleteApiTokensInProject(koblenzRegionManager), false)
            assertEquals(Authorizer.mayDeleteApiTokensInProject(koblenzRegionAdmin), false)
            assertEquals(Authorizer.mayDeleteApiTokensInProject(koblenzRegionManager), false)
            assertEquals(Authorizer.mayDeleteApiTokensInProject(nuernbergStoreManager), false)
        }
    }

    @Test
    fun testMayViewHashingPepper() {
        transaction {
            assertEquals(Authorizer.mayViewHashingPepper(koblenzProjectAdmin), true)

            assertEquals(Authorizer.mayViewHashingPepper(bayernProjectAdmin), false)
            assertEquals(Authorizer.mayViewHashingPepper(bayernExternalUser), false)
            assertEquals(Authorizer.mayViewHashingPepper(bayernRegionAdmin), false)
            assertEquals(Authorizer.mayViewHashingPepper(bayernRegionManager), false)
            assertEquals(Authorizer.mayViewHashingPepper(koblenzRegionManager), false)
            assertEquals(Authorizer.mayViewHashingPepper(koblenzRegionAdmin), false)
            assertEquals(Authorizer.mayViewHashingPepper(koblenzRegionManager), false)
            assertEquals(Authorizer.mayViewHashingPepper(nuernbergProjectAdmin), false)
            assertEquals(Authorizer.mayViewHashingPepper(nuernbergStoreManager), false)
        }
    }

    @Test
    fun testMayUpdateStoresInProject() {
        transaction {
            assertEquals(Authorizer.mayUpdateStoresInProject(nuernbergStoreManager, 2), true)
            assertEquals(Authorizer.mayUpdateStoresInProject(nuernbergProjectAdmin, 2), false)
        }
    }
}
