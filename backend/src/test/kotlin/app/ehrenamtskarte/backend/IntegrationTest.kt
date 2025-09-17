package app.ehrenamtskarte.backend

import app.ehrenamtskarte.backend.config.PostgresConfig
import app.ehrenamtskarte.backend.db.Database
import app.ehrenamtskarte.backend.db.migration.MigrationUtils
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.TestFreinetAgencies
import org.junit.jupiter.api.BeforeAll
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ContextConfiguration
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.utility.DockerImageName

/**
 * Base class for integration tests that require a database connection
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ContextConfiguration(classes = [IntegrationTestConfig::class])
class IntegrationTest {
    companion object {
        private var postgisImage = DockerImageName.parse("postgis/postgis:13-3.0-alpine")
        internal var postgisContainer = PostgreSQLContainer(
            postgisImage.asCompatibleSubstituteFor("postgres"),
        )

        init {
            postgisContainer.start()
            setupDatabase()
        }

        @JvmStatic
        @BeforeAll
        fun loadTestData() {
            TestAdministrators.createAll()
            TestFreinetAgencies.create()
        }

        private fun setupDatabase() {
            val config = IntegrationTestConfig().backendConfiguration().copy(
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
    }
}
