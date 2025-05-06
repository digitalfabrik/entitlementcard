package app.ehrenamtskarte.backend

import app.ehrenamtskarte.backend.common.database.Database
import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.config.PostgresConfig
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.TestFreinetAgencies
import app.ehrenamtskarte.backend.migration.MigrationUtils
import org.junit.jupiter.api.BeforeAll
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.utility.DockerImageName

/**
 * Base class for integration tests that require a database connection
 */
open class IntegrationTest {
    companion object {
        @JvmStatic
        protected val config = loadTestConfig()

        private val postgisImage = DockerImageName.parse("postgis/postgis:13-3.0-alpine")
        private val postgisContainer = PostgreSQLContainer(
            postgisImage.asCompatibleSubstituteFor("postgres"),
        )

        @JvmStatic
        @BeforeAll
        fun setupDatabase() {
            if (postgisContainer.isRunning) {
                createTestData()
                return
            }
            postgisContainer.start()
            val configOverride = config.copy(
                postgres = postgisContainer.asPostgresConfig(),
            )
            Database.setupWithoutMigrationCheck(configOverride).also {
                MigrationUtils.applyRequiredMigrations(it)
                Database.setupInitialData(configOverride)
            }
            createTestData()
        }

        private fun createTestData() {
            TestAdministrators.createAll()
            TestFreinetAgencies.create()
        }

        private fun PostgreSQLContainer<*>.asPostgresConfig() =
            PostgresConfig(
                url = jdbcUrl,
                user = username,
                password = password,
            )

        private fun loadTestConfig(): BackendConfiguration {
            val resource = ClassLoader.getSystemResource("config.test.yml")
                ?: throw Exception("Configuration file 'config.test.yml' not found")
            return BackendConfiguration.load(resource)
        }
    }
}
