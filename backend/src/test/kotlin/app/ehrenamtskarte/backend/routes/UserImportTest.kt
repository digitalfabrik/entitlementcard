package app.ehrenamtskarte.backend.routes

import app.ehrenamtskarte.backend.IntegrationTest
import app.ehrenamtskarte.backend.db.entities.ApiTokenType
import app.ehrenamtskarte.backend.db.entities.ApiTokens
import app.ehrenamtskarte.backend.db.entities.CardEntity
import app.ehrenamtskarte.backend.db.entities.Cards
import app.ehrenamtskarte.backend.db.entities.UserEntitlements
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.TestData
import app.ehrenamtskarte.backend.util.CsvGenerator.generateCsvFile
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.jdbc.deleteAll
import org.jetbrains.exposed.v1.jdbc.selectAll
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.core.io.ByteArrayResource
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.mock.web.MockMultipartFile
import org.springframework.util.LinkedMultiValueMap
import java.io.File
import java.time.LocalDate
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

internal class UserImportTest : IntegrationTest() {
    companion object {
        private const val TEST_CSV_FILE_PATH = "build/tmp/test.csv"
        private const val TEST_USER_HASH =
            $$"$argon2id$v=19$m=19456,t=2,p=1$57YPIKvU/XE9h7/JA0tZFT2TzpwBQfYAW6K+ojXBh5w"
    }

    data class UserImportResponse(val message: String)

    private val admin = TestAdministrators.KOBLENZ_PROJECT_ADMIN

    @BeforeEach
    fun cleanUp() {
        transaction {
            Cards.deleteAll()
            ApiTokens.deleteAll()
            UserEntitlements.deleteAll()
        }
    }

    @Test
    fun `POST returns an error response when the auth token is missing`() {
        val response = importUsers(generateCsvFile(TEST_CSV_FILE_PATH), token = null)

        assertEquals(HttpStatus.UNAUTHORIZED, response.statusCode)
        assertEquals("Authorization token expired, invalid or missing", response.body?.message)
    }

    @Test
    fun `POST returns an error response when the auth token is expired`() {
        TestData.createApiToken(
            creatorId = admin.id,
            expirationDate = LocalDate.now().minusDays(1),
            type = ApiTokenType.USER_IMPORT,
        )

        val response = importUsers(generateCsvFile(TEST_CSV_FILE_PATH))

        assertEquals(HttpStatus.UNAUTHORIZED, response.statusCode)
        assertEquals("Authorization token expired, invalid or missing", response.body?.message)
    }

    @Test
    fun `POST returns an error response when the auth token has wrong type`() {
        TestData.createApiToken(
            creatorId = admin.id,
            type = ApiTokenType.VERIFIED_APPLICATION,
        )

        val response = importUsers(generateCsvFile(TEST_CSV_FILE_PATH))

        assertEquals(HttpStatus.FORBIDDEN, response.statusCode)
        assertEquals("Insufficient access rights", response.body?.message)
    }

    @Test
    fun `POST returns an error response when self-service is not enabled in the project`() {
        TestData.createApiToken(
            creatorId = TestAdministrators.EAK_PROJECT_ADMIN.id,
            type = ApiTokenType.USER_IMPORT,
        )

        val response = importUsers(generateCsvFile(TEST_CSV_FILE_PATH))

        assertEquals(HttpStatus.BAD_REQUEST, response.statusCode)
        assertEquals("User import is not enabled for this project", response.body?.message)
    }

    @Test
    fun `POST returns an error response when no file uploaded`() {
        TestData.createApiToken(creatorId = admin.id, type = ApiTokenType.USER_IMPORT)

        val response = importUsers()

        assertEquals(HttpStatus.BAD_REQUEST, response.statusCode)
        assertEquals("No file uploaded", response.body?.message)
    }

    @Test
    fun `POST returns an error response when multiple files uploaded`() {
        TestData.createApiToken(creatorId = admin.id, type = ApiTokenType.USER_IMPORT)

        val csvFile = generateCsvFile(TEST_CSV_FILE_PATH, listOf("dummy"))

        val response = importUsers(csvFile, csvFile)

        assertEquals(HttpStatus.BAD_REQUEST, response.statusCode)
        assertEquals("Multiple files uploaded", response.body?.message)
    }

    @Test
    fun `POST returns an error response when required columns are missing`() {
        TestData.createApiToken(creatorId = admin.id, type = ApiTokenType.USER_IMPORT)

        val csvFile = generateCsvFile(TEST_CSV_FILE_PATH, listOf("regionKey", "revoked"))

        val response = importUsers(csvFile)

        assertEquals(HttpStatus.BAD_REQUEST, response.statusCode)
        assertEquals("Missing required columns: [userHash, startDate, endDate]", response.body?.message)

        transaction {
            assertEquals(0, UserEntitlements.selectAll().count())
        }
    }

    @Test
    fun `POST returns an error response when some data is missing`() {
        TestData.createApiToken(creatorId = admin.id, type = ApiTokenType.USER_IMPORT)

        val csvFile =
            generateCsvFile(
                TEST_CSV_FILE_PATH,
                listOf("regionKey", "userHash", "startDate", "endDate", "revoked"),
                listOf("01.01.2024", "01.01.2025", "false"),
            )

        val response = importUsers(csvFile)

        assertEquals(HttpStatus.BAD_REQUEST, response.statusCode)
        assertEquals("Error at line 1: Missing data", response.body?.message)

        transaction {
            assertEquals(0, UserEntitlements.selectAll().count())
        }
    }

    @Test
    fun `POST returns an error response when region not found`() {
        TestData.createApiToken(creatorId = admin.id, type = ApiTokenType.USER_IMPORT)

        val csvFile = generateCsvFile(
            TEST_CSV_FILE_PATH,
            listOf("regionKey", "userHash", "startDate", "endDate", "revoked"),
            listOf("12345", "\"$TEST_USER_HASH\"", "01.01.2024", "01.01.2025", "false"),
        )

        val response = importUsers(csvFile)

        assertEquals(HttpStatus.BAD_REQUEST, response.statusCode)
        assertEquals(
            "Error at line 1: Specified region not found for the current project",
            response.body?.message,
        )

        transaction {
            assertEquals(0, UserEntitlements.selectAll().count())
        }
    }

    @Test
    fun `POST returns an error response when userHash is not valid`() {
        TestData.createApiToken(creatorId = admin.id, type = ApiTokenType.USER_IMPORT)

        val csvFile = generateCsvFile(
            TEST_CSV_FILE_PATH,
            listOf("regionKey", "userHash", "startDate", "endDate", "revoked"),
            listOf("07111", "UIOJZIsSL8vXcu", "01.01.2024", "01.01.2025", "false"),
        )

        val response = importUsers(csvFile)

        assertEquals(HttpStatus.BAD_REQUEST, response.statusCode)
        assertEquals("Error at line 1: Failed to validate userHash", response.body?.message)

        transaction {
            assertEquals(0, UserEntitlements.selectAll().count())
        }
    }

    @Test
    fun `POST returns an error response when startDate has incorrect format`() {
        TestData.createApiToken(creatorId = admin.id, type = ApiTokenType.USER_IMPORT)

        val csvFile = generateCsvFile(
            TEST_CSV_FILE_PATH,
            listOf("regionKey", "userHash", "startDate", "endDate", "revoked"),
            listOf("07111", "\"$TEST_USER_HASH\"", "2024-01-01", "01.01.2025", "false"),
        )

        val response = importUsers(csvFile)

        assertEquals(HttpStatus.BAD_REQUEST, response.statusCode)
        assertEquals(
            "Error at line 1: Failed to parse date [2024-01-01]. Expected format: dd.MM.yyyy",
            response.body?.message,
        )

        transaction {
            assertEquals(0, UserEntitlements.selectAll().count())
        }
    }

    @Test
    fun `POST returns an error response when endDate has incorrect format`() {
        TestData.createApiToken(creatorId = admin.id, type = ApiTokenType.USER_IMPORT)

        val csvFile = generateCsvFile(
            TEST_CSV_FILE_PATH,
            listOf("regionKey", "userHash", "startDate", "endDate", "revoked"),
            listOf("07111", "\"$TEST_USER_HASH\"", "01.01.2024", "2025-01-01", "false"),
        )

        val response = importUsers(csvFile)

        assertEquals(HttpStatus.BAD_REQUEST, response.statusCode)
        assertEquals(
            "Error at line 1: Failed to parse date [2025-01-01]. Expected format: dd.MM.yyyy",
            response.body?.message,
        )

        transaction {
            assertEquals(0, UserEntitlements.selectAll().count())
        }
    }

    @Test
    fun `POST returns an error response when startDate is after endDate`() {
        TestData.createApiToken(creatorId = admin.id, type = ApiTokenType.USER_IMPORT)

        val csvFile = generateCsvFile(
            TEST_CSV_FILE_PATH,
            listOf("regionKey", "userHash", "startDate", "endDate", "revoked"),
            listOf("07111", "\"$TEST_USER_HASH\"", "01.01.2025", "01.01.2024", "false"),
        )

        val response = importUsers(csvFile)

        assertEquals(HttpStatus.BAD_REQUEST, response.statusCode)
        assertEquals("Error at line 1: Start date cannot be after end date", response.body?.message)

        transaction {
            assertEquals(0, UserEntitlements.selectAll().count())
        }
    }

    @Test
    fun `POST returns an error response when revoked is not boolean`() {
        TestData.createApiToken(creatorId = admin.id, type = ApiTokenType.USER_IMPORT)

        val csvFile = generateCsvFile(
            TEST_CSV_FILE_PATH,
            listOf("regionKey", "userHash", "startDate", "endDate", "revoked"),
            listOf("07111", "\"$TEST_USER_HASH\"", "01.01.2024", "01.01.2025", "12345"),
        )

        val response = importUsers(csvFile)

        assertEquals(HttpStatus.BAD_REQUEST, response.statusCode)
        assertEquals("Error at line 1: Revoked must be a boolean value", response.body?.message)

        transaction {
            assertEquals(0, UserEntitlements.selectAll().count())
        }
    }

    @Test
    fun `POST returns a successful response when new user entitlements are saved in db`() {
        TestData.createApiToken(creatorId = admin.id, type = ApiTokenType.USER_IMPORT)

        val csvFile = generateCsvFile(
            TEST_CSV_FILE_PATH,
            listOf("regionKey", "userHash", "startDate", "endDate", "revoked"),
            listOf("07111", "\"$TEST_USER_HASH\"", "01.01.2024", "01.01.2025", "false"),
        )

        val response = importUsers(csvFile)

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals("Import successfully completed", response.body?.message)

        transaction {
            assertEquals(1, UserEntitlements.selectAll().count())
            UserEntitlements.selectAll().single().let {
                assertEquals(TEST_USER_HASH, it[UserEntitlements.userHash].decodeToString())
                assertEquals(LocalDate.of(2024, 1, 1), it[UserEntitlements.startDate])
                assertEquals(LocalDate.of(2025, 1, 1), it[UserEntitlements.endDate])
                assertEquals(96, it[UserEntitlements.regionId].value)
                assertEquals(false, it[UserEntitlements.revoked])
                assertNotNull(it[UserEntitlements.lastUpdated])
            }
        }
    }

    @Test
    fun `POST returns a successful response and user entitlements are updated in db`() {
        TestData.createApiToken(creatorId = admin.id, type = ApiTokenType.USER_IMPORT)
        TestData.createUserEntitlement(
            userHash = TEST_USER_HASH,
            regionId = 1,
        )

        val csvFile = generateCsvFile(
            TEST_CSV_FILE_PATH,
            listOf("regionKey", "userHash", "startDate", "endDate", "revoked"),
            listOf("07111", "\"$TEST_USER_HASH\"", "01.02.2024", "01.02.2025", "true"),
        )

        val response = importUsers(csvFile)

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals("Import successfully completed", response.body?.message)

        transaction {
            assertEquals(1, UserEntitlements.selectAll().count())
            UserEntitlements.selectAll().single().let {
                assertEquals(TEST_USER_HASH, it[UserEntitlements.userHash].decodeToString())
                assertEquals(LocalDate.of(2024, 2, 1), it[UserEntitlements.startDate])
                assertEquals(LocalDate.of(2025, 2, 1), it[UserEntitlements.endDate])
                assertEquals(96, it[UserEntitlements.regionId].value)
                assertEquals(true, it[UserEntitlements.revoked])
                assertNotNull(it[UserEntitlements.lastUpdated])
            }
        }
    }

    @Test
    fun `POST returns a successful response and existing cards are revoked when user entitlement has been revoked`() {
        TestData.createApiToken(creatorId = admin.id, type = ApiTokenType.USER_IMPORT)
        val entitlementId = TestData.createUserEntitlement(
            userHash = TEST_USER_HASH,
            regionId = 1,
        )
        val dynamicCardId = TestData.createDynamicCard(entitlementId = entitlementId)
        val staticCardId = TestData.createStaticCard(entitlementId = entitlementId)

        val csvFile = generateCsvFile(
            TEST_CSV_FILE_PATH,
            listOf("regionKey", "userHash", "startDate", "endDate", "revoked"),
            listOf("07111", "\"$TEST_USER_HASH\"", "01.02.2024", "01.02.2025", "true"),
        )

        val response = importUsers(csvFile)

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals("Import successfully completed", response.body?.message)

        transaction {
            assertTrue(CardEntity.find { Cards.id eq dynamicCardId }.single().revoked)
            assertTrue(CardEntity.find { Cards.id eq staticCardId }.single().revoked)
        }
    }

    private fun importUsers(vararg files: File, token: String? = "dummy"): ResponseEntity<UserImportResponse> {
        val headers = HttpHeaders()
        token?.let { headers.setBearerAuth(it) }

        val body = LinkedMultiValueMap<String, Any>()
        files.forEach { file ->
            val multipart = MockMultipartFile("file", file.name, "text/csv", file.readBytes())
            val fileResource = object : ByteArrayResource(multipart.bytes) {
                override fun getFilename() = multipart.originalFilename
            }
            body.add("file", fileResource)
        }

        val requestEntity = HttpEntity(body, headers)
        return restTemplate.exchange("/users/import", HttpMethod.POST, requestEntity, UserImportResponse::class.java)
    }
}
