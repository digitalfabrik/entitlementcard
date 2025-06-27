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
        private var postgisImage = DockerImageName.parse("postgis/postgis:13-3.0-alpine")
        private var postgisContainer = PostgreSQLContainer(
            postgisImage.asCompatibleSubstituteFor("postgres"),
        )

        init {
            postgisContainer.start()
            setupDatabase()
        }

        @JvmStatic
        protected val config = loadTestConfig()

        @JvmStatic
        @BeforeAll
        fun loadTestData() {
            TestAdministrators.createAll()
            TestFreinetAgencies.create()
        }

        private fun setupDatabase() {
            val config = loadTestConfig()
                .copy(
                    postgres = PostgresConfig(
                        postgisContainer.jdbcUrl,
                        postgisContainer.username,
                        postgisContainer.password,
                    ),
                )
            val database = Database.setupWithoutMigrationCheck(config)
            MigrationUtils.applyRequiredMigrations(database)
            Database.setupWithInitialDataAndMigrationChecks(config)
        }

        private fun loadTestConfig(): BackendConfiguration {
            val resource = ClassLoader.getSystemResource("config.test.yml")
                ?: throw Exception("Configuration resource 'src/test/resources/config.test.yml' not found")
            return BackendConfiguration.load(resource)
        }
    }
}
