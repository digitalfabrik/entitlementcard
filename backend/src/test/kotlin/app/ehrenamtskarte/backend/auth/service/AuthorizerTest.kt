package app.ehrenamtskarte.backend.auth.service

import app.ehrenamtskarte.backend.IntegrationTest
import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.database.Administrators
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Role
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.time.Instant
import kotlin.test.assertEquals

internal class AuthorizerTest : IntegrationTest() {
    private val emailStoreManager = "project-store-manager@test.de"
    private val emailProjectAdmin = "project-admin@test.de"

    // prepare user test data
    @BeforeEach
    fun createTestUsers() {
        transaction {
            Administrators.insert {
                it[email] = emailStoreManager
                it[projectId] = 2
                it[regionId] = null
                it[role] = Role.PROJECT_STORE_MANAGER.db_value
                it[passwordHash] = "34u23nke2131sad".toByteArray()
                it[passwordResetKeyHash] = "34u23nke2131sad".toByteArray()
                it[passwordResetKeyExpiry] = Instant.now()
                it[deleted] = false
            }

            Administrators.insert {
                it[email] = emailProjectAdmin
                it[projectId] = 2
                it[regionId] = null
                it[role] = Role.PROJECT_ADMIN.db_value
                it[passwordHash] = "34u23nke2131sad".toByteArray()
                it[passwordResetKeyHash] = "34u23nke2131sad".toByteArray()
                it[passwordResetKeyExpiry] = Instant.now()
                it[deleted] = false
            }
        }

        transaction {
            assertEquals(2, Administrators.selectAll().count())
        }
    }

    @AfterEach
    fun cleanUpUsers() {
        transaction {
            Administrators.deleteAll()
        }
    }

    @Test
    fun testMayUpdateStoresInProject() {
        transaction {
            val storeManager = AdministratorEntity.find { Administrators.email eq emailStoreManager }.single()
            val projectAdmin = AdministratorEntity.find { Administrators.email eq emailProjectAdmin }.single()
            assertEquals(Authorizer.mayUpdateStoresInProject(storeManager, 2), true)
            assertEquals(Authorizer.mayUpdateStoresInProject(projectAdmin, 2), false)
        }
    }
}
