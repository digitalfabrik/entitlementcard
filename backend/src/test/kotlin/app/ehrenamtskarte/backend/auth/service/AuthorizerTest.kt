package app.ehrenamtskarte.backend.auth.service

import app.ehrenamtskarte.backend.IntegrationTest
import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.database.Administrators
import app.ehrenamtskarte.backend.helper.TestAdministrators
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals

internal class AuthorizerTest : IntegrationTest() {

    @Test
    fun testMayUpdateStoresInProject() {
        transaction {
            val storeManager = AdministratorEntity.find { Administrators.email eq TestAdministrators.NUERNBERG_PROJECT_STORE_MANAGER.email }.single()
            val projectAdmin = AdministratorEntity.find { Administrators.email eq TestAdministrators.NUERNBERG_PROJECT_ADMIN.email }.single()
            assertEquals(Authorizer.mayUpdateStoresInProject(storeManager, 2), true)
            assertEquals(Authorizer.mayUpdateStoresInProject(projectAdmin, 2), false)
        }
    }
}
