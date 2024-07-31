package app.ehrenamtskarte.backend

import app.ehrenamtskarte.backend.common.database.Database
import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.config.PostgresConfig
import app.ehrenamtskarte.backend.migration.MigrationUtils
import org.junit.AfterClass
import org.junit.BeforeClass
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.utility.DockerImageName

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
}
