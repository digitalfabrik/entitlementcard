package app.ehrenamtskarte.backend

import app.ehrenamtskarte.backend.config.PostgresConfig
import app.ehrenamtskarte.backend.db.Database
import app.ehrenamtskarte.backend.db.migration.MigrationUtils
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.TestFreinetAgencies
import com.expediagroup.graphql.client.types.GraphQLClientRequest
import org.junit.jupiter.api.BeforeAll
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseEntity
import org.springframework.test.context.ContextConfiguration
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.utility.DockerImageName

/**
 * Base class for integration tests providing a fully initialized Spring Boot application context
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ContextConfiguration(classes = [IntegrationTestConfig::class])
open class IntegrationTest {
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

    @Autowired
    protected lateinit var restTemplate: TestRestTemplate

    protected fun postGraphQL(request: GraphQLClientRequest<*>, token: String? = null): ResponseEntity<String> {
        val headers = HttpHeaders().apply {
            token?.let { setBearerAuth(it) }
        }
        val entity = HttpEntity(request, headers)
        return restTemplate.postForEntity("/", entity, String::class.java)
    }
}
