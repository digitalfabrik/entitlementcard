package app.ehrenamtskarte.backend

import app.ehrenamtskarte.backend.common.database.Database
import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.config.PostgresConfig
import app.ehrenamtskarte.backend.migration.MigrationUtils
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.regions.database.RegionEntity
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.AfterClass
import org.junit.BeforeClass
import org.junit.Test
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.utility.DockerImageName
import kotlin.test.assertEquals

/**
 * Base class for integration tests that require a database connection
 */
open class IntegrationTest {
    companion object {
        private var postgisImage = DockerImageName.parse("postgis/postgis:13-3.0-alpine")
        private var postgisContainer = PostgreSQLContainer(postgisImage.asCompatibleSubstituteFor("postgres"))

        @JvmStatic
        @BeforeClass
        fun setupDatabase() {
            postgisContainer.start()
            val resource = ClassLoader.getSystemResource("config.test.yml")
                ?: throw Exception("Configuration file 'config.test.yml' not found")
            val config = BackendConfiguration.load(resource)
                .copy(postgres = PostgresConfig(postgisContainer.jdbcUrl, postgisContainer.username, postgisContainer.password))
            val database = Database.setupWithoutMigrationCheck(config)
            MigrationUtils.applyRequiredMigrations(database)
            Database.setupInitialData(config)
        }

        @JvmStatic
        @AfterClass
        fun tearDownDatabase() {
            postgisContainer.stop()
        }
    }

    /**
     * Temporary tests to verify that the database is properly configured
     */
    @Test
    fun verifyProjectCount() {
        var projectCount = 0L
        transaction {
            projectCount = ProjectEntity.count()
        }
        assertEquals(2L, projectCount)
    }

    @Test
    fun verifyRegionCount() {
        var regionCount = 0L
        transaction {
            regionCount = RegionEntity.count()
        }
        assertEquals(94L, regionCount)
    }
}
