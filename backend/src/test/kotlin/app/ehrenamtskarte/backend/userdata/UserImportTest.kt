package app.ehrenamtskarte.backend.userdata

import app.ehrenamtskarte.backend.IntegrationTest
import app.ehrenamtskarte.backend.auth.database.ApiTokenType
import app.ehrenamtskarte.backend.auth.database.ApiTokens
import app.ehrenamtskarte.backend.cards.database.CardEntity
import app.ehrenamtskarte.backend.cards.database.Cards
import app.ehrenamtskarte.backend.helper.TestAdministrators
import app.ehrenamtskarte.backend.helper.TestData
import app.ehrenamtskarte.backend.userdata.database.UserEntitlements
import app.ehrenamtskarte.backend.userdata.webservice.UserImportHandler
import app.ehrenamtskarte.backend.util.CsvGenerator.generateCsvFile
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.javalin.Javalin
import io.javalin.testtools.HttpClient
import io.javalin.testtools.JavalinTest
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.Request
import okhttp3.RequestBody.Companion.asRequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.io.File
import java.time.LocalDate
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

private const val USER_IMPORT_PATH = "/users/import"
private const val TEST_CSV_FILE_PATH = "build/tmp/test.csv"
private const val TEST_USER_HASH = "\$argon2id\$v=19\$m=19456,t=2,p=1\$57YPIKvU/XE9h7/JA0tZFT2TzpwBQfYAW6K+ojXBh5w"

internal class UserImportTest : IntegrationTest() {

    private val app: Javalin = Javalin.create().apply {
        val backendConfiguration = loadTestConfig()
        post(USER_IMPORT_PATH) { ctx -> UserImportHandler(backendConfiguration).handle(ctx) }
    }

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
    fun `POST returns an error response when the auth token is missing`() = JavalinTest.test(app) { _, client ->
        val response = importUsers(client, csvFile = null, token = null)

        assertEquals(401, response.code)

        val jsonResponse = jacksonObjectMapper().readTree(response.body?.string())

        assertEquals("Authorization token expired, invalid or missing", jsonResponse["message"].asText())
    }

    @Test
    fun `POST returns an error response when the auth token is expired`() = JavalinTest.test(app) { _, client ->
        TestData.createApiToken(creatorId = admin.id, expirationDate = LocalDate.now(), type = ApiTokenType.USER_IMPORT)

        val response = importUsers(client, csvFile = null)

        assertEquals(403, response.code)

        val jsonResponse = jacksonObjectMapper().readTree(response.body?.string())

        assertEquals("Insufficient access rights", jsonResponse["message"].asText())
    }

    @Test
    fun `POST returns an error response when the auth token has wrong type`() = JavalinTest.test(app) { _, client ->
        TestData.createApiToken(creatorId = admin.id, expirationDate = LocalDate.now(), type = ApiTokenType.VERIFIED_APPLICATION)

        val response = importUsers(client, csvFile = null)

        assertEquals(403, response.code)

        val jsonResponse = jacksonObjectMapper().readTree(response.body?.string())

        assertEquals("Insufficient access rights", jsonResponse["message"].asText())
    }

    @Test
    fun `POST returns an error response when self-service is not enabled in the project`() = JavalinTest.test(app) { _, client ->
        TestData.createApiToken(creatorId = TestAdministrators.EAK_PROJECT_ADMIN.id, type = ApiTokenType.USER_IMPORT)

        val response = importUsers(client, csvFile = null)

        assertEquals(400, response.code)

        val jsonResponse = jacksonObjectMapper().readTree(response.body?.string())

        assertEquals("User import is not enabled in the project", jsonResponse["message"].asText())
    }

    @Test
    fun `POST returns an error response when no file uploaded`() = JavalinTest.test(app) { _, client ->
        TestData.createApiToken(creatorId = admin.id, type = ApiTokenType.USER_IMPORT)

        val response = importUsers(client, csvFile = null)

        assertEquals(400, response.code)

        val jsonResponse = jacksonObjectMapper().readTree(response.body?.string())

        assertEquals("No file uploaded", jsonResponse["message"].asText())
    }

    @Test
    fun `POST returns an error response when multiple files uploaded`() = JavalinTest.test(app) { _, client ->
        TestData.createApiToken(creatorId = admin.id, type = ApiTokenType.USER_IMPORT)

        val csvFile = generateCsvFile(TEST_CSV_FILE_PATH, listOf("dummy"))

        val requestBody = MultipartBody.Builder()
            .setType(MultipartBody.FORM)
            .addFormDataPart(
                "file",
                "test-1.csv",
                csvFile.asRequestBody("text/csv".toMediaTypeOrNull())
            )
            .addFormDataPart(
                "file",
                "test-2.csv",
                csvFile.asRequestBody("text/csv".toMediaTypeOrNull())
            )
            .build()

        val request = Request.Builder()
            .url(client.origin + USER_IMPORT_PATH)
            .addHeader("Authorization", "Bearer dummy")
            .post(requestBody)
            .build()

        val response = client.request(request)

        assertEquals(400, response.code)

        val jsonResponse = jacksonObjectMapper().readTree(response.body?.string())

        assertEquals("Multiple files uploaded", jsonResponse["message"].asText())
    }

    @Test
    fun `POST returns an error response when required columns are missing`() = JavalinTest.test(app) { _, client ->
        TestData.createApiToken(creatorId = admin.id, type = ApiTokenType.USER_IMPORT)

        val csvFile = generateCsvFile(TEST_CSV_FILE_PATH, listOf("regionKey", "revoked"))
        val response = importUsers(client, csvFile)

        assertEquals(400, response.code)

        val jsonResponse = jacksonObjectMapper().readTree(response.body?.string())

        assertEquals("Missing required columns: [userHash, startDate, endDate]", jsonResponse["message"].asText())

        transaction {
            assertEquals(0, UserEntitlements.selectAll().count())
        }
    }

    @Test
    fun `POST returns an error response when some data is missing`() = JavalinTest.test(app) { _, client ->
        TestData.createApiToken(creatorId = admin.id, type = ApiTokenType.USER_IMPORT)

        val csvFile = generateCsvFile(
            TEST_CSV_FILE_PATH,
            listOf("regionKey", "userHash", "startDate", "endDate", "revoked"),
            listOf("01.01.2024", "01.01.2025", "false")
        )
        val response = importUsers(client, csvFile)

        assertEquals(400, response.code)

        val jsonResponse = jacksonObjectMapper().readTree(response.body?.string())

        assertEquals("Error at line 1: Missing data", jsonResponse["message"].asText())

        transaction {
            assertEquals(0, UserEntitlements.selectAll().count())
        }
    }

    @Test
    fun `POST returns an error response when region not found`() = JavalinTest.test(app) { _, client ->
        TestData.createApiToken(creatorId = admin.id, type = ApiTokenType.USER_IMPORT)

        val csvFile = generateCsvFile(
            TEST_CSV_FILE_PATH,
            listOf("regionKey", "userHash", "startDate", "endDate", "revoked"),
            listOf("12345", "\"$TEST_USER_HASH\"", "01.01.2024", "01.01.2025", "false")
        )
        val response = importUsers(client, csvFile)

        assertEquals(400, response.code)

        val jsonResponse = jacksonObjectMapper().readTree(response.body?.string())

        assertEquals("Error at line 1: Specified region not found for the current project", jsonResponse["message"].asText())

        transaction {
            assertEquals(0, UserEntitlements.selectAll().count())
        }
    }

    @Test
    fun `POST returns an error response when userHash is not valid`() = JavalinTest.test(app) { _, client ->
        TestData.createApiToken(creatorId = admin.id, type = ApiTokenType.USER_IMPORT)

        val csvFile = generateCsvFile(
            TEST_CSV_FILE_PATH,
            listOf("regionKey", "userHash", "startDate", "endDate", "revoked"),
            listOf("07111", "UIOJZIsSL8vXcu", "01.01.2024", "01.01.2025", "false")
        )
        val response = importUsers(client, csvFile)

        assertEquals(400, response.code)

        val jsonResponse = jacksonObjectMapper().readTree(response.body?.string())

        assertEquals("Error at line 1: Failed to validate userHash", jsonResponse["message"].asText())

        transaction {
            assertEquals(0, UserEntitlements.selectAll().count())
        }
    }

    @Test
    fun `POST returns an error response when startDate has incorrect format`() = JavalinTest.test(app) { _, client ->
        TestData.createApiToken(creatorId = admin.id, type = ApiTokenType.USER_IMPORT)

        val csvFile = generateCsvFile(
            TEST_CSV_FILE_PATH,
            listOf("regionKey", "userHash", "startDate", "endDate", "revoked"),
            listOf("07111", "\"$TEST_USER_HASH\"", "2024-01-01", "01.01.2025", "false")
        )
        val response = importUsers(client, csvFile)

        assertEquals(400, response.code)

        val jsonResponse = jacksonObjectMapper().readTree(response.body?.string())

        assertEquals(
            "Error at line 1: Failed to parse date [2024-01-01]. Expected format: dd.MM.yyyy",
            jsonResponse["message"].asText()
        )

        transaction {
            assertEquals(0, UserEntitlements.selectAll().count())
        }
    }

    @Test
    fun `POST returns an error response when endDate has incorrect format`() = JavalinTest.test(app) { _, client ->
        TestData.createApiToken(creatorId = admin.id, type = ApiTokenType.USER_IMPORT)

        val csvFile = generateCsvFile(
            TEST_CSV_FILE_PATH,
            listOf("regionKey", "userHash", "startDate", "endDate", "revoked"),
            listOf("07111", "\"$TEST_USER_HASH\"", "01.01.2024", "2025-01-01", "false")
        )
        val response = importUsers(client, csvFile)

        assertEquals(400, response.code)

        val jsonResponse = jacksonObjectMapper().readTree(response.body?.string())

        assertEquals(
            "Error at line 1: Failed to parse date [2025-01-01]. Expected format: dd.MM.yyyy",
            jsonResponse["message"].asText()
        )

        transaction {
            assertEquals(0, UserEntitlements.selectAll().count())
        }
    }

    @Test
    fun `POST returns an error response when startDate is after endDate`() = JavalinTest.test(app) { _, client ->
        TestData.createApiToken(creatorId = admin.id, type = ApiTokenType.USER_IMPORT)

        val csvFile = generateCsvFile(
            TEST_CSV_FILE_PATH,
            listOf("regionKey", "userHash", "startDate", "endDate", "revoked"),
            listOf("07111", "\"$TEST_USER_HASH\"", "01.01.2025", "01.01.2024", "false")
        )
        val response = importUsers(client, csvFile)

        assertEquals(400, response.code)

        val jsonResponse = jacksonObjectMapper().readTree(response.body?.string())

        assertEquals(
            "Error at line 1: Start date cannot be after end date",
            jsonResponse["message"].asText()
        )

        transaction {
            assertEquals(0, UserEntitlements.selectAll().count())
        }
    }

    @Test
    fun `POST returns an error response when revoked is not boolean`() = JavalinTest.test(app) { _, client ->
        TestData.createApiToken(creatorId = admin.id, type = ApiTokenType.USER_IMPORT)

        val csvFile = generateCsvFile(
            TEST_CSV_FILE_PATH,
            listOf("regionKey", "userHash", "startDate", "endDate", "revoked"),
            listOf("07111", "\"$TEST_USER_HASH\"", "01.01.2024", "01.01.2025", "12345")
        )
        val response = importUsers(client, csvFile)

        assertEquals(400, response.code)

        val jsonResponse = jacksonObjectMapper().readTree(response.body?.string())

        assertEquals(
            "Error at line 1: Revoked must be a boolean value",
            jsonResponse["message"].asText()
        )

        transaction {
            assertEquals(0, UserEntitlements.selectAll().count())
        }
    }

    @Test
    fun `POST returns a successful response when new user entitlements are saved in db`() = JavalinTest.test(app) { _, client ->
        TestData.createApiToken(creatorId = admin.id, type = ApiTokenType.USER_IMPORT)

        val csvFile = generateCsvFile(
            TEST_CSV_FILE_PATH,
            listOf("regionKey", "userHash", "startDate", "endDate", "revoked"),
            listOf("07111", "\"$TEST_USER_HASH\"", "01.01.2024", "01.01.2025", "false")
        )
        val response = importUsers(client, csvFile)

        assertEquals(200, response.code)

        val jsonResponse = jacksonObjectMapper().readTree(response.body?.string())

        assertEquals("Import successfully completed", jsonResponse["message"].asText())

        transaction {
            assertEquals(1, UserEntitlements.selectAll().count())
            UserEntitlements.selectAll().single().let {
                assertEquals(TEST_USER_HASH, it[UserEntitlements.userHash].decodeToString())
                assertEquals(LocalDate.of(2024, 1, 1), it[UserEntitlements.startDate])
                assertEquals(LocalDate.of(2025, 1, 1), it[UserEntitlements.endDate])
                assertEquals(95, it[UserEntitlements.regionId].value)
                assertEquals(false, it[UserEntitlements.revoked])
                assertNotNull(it[UserEntitlements.lastUpdated])
            }
        }
    }

    @Test
    fun `POST returns a successful response and user entitlements are updated in db`() = JavalinTest.test(app) { _, client ->
        TestData.createApiToken(creatorId = admin.id, type = ApiTokenType.USER_IMPORT)
        TestData.createUserEntitlement(
            userHash = TEST_USER_HASH,
            regionId = 1
        )

        val csvFile = generateCsvFile(
            TEST_CSV_FILE_PATH,
            listOf("regionKey", "userHash", "startDate", "endDate", "revoked"),
            listOf("07111", "\"$TEST_USER_HASH\"", "01.02.2024", "01.02.2025", "true")
        )
        val response = importUsers(client, csvFile)

        assertEquals(200, response.code)

        val jsonResponse = jacksonObjectMapper().readTree(response.body?.string())

        assertEquals("Import successfully completed", jsonResponse["message"].asText())

        transaction {
            assertEquals(1, UserEntitlements.selectAll().count())
            UserEntitlements.selectAll().single().let {
                assertEquals(TEST_USER_HASH, it[UserEntitlements.userHash].decodeToString())
                assertEquals(LocalDate.of(2024, 2, 1), it[UserEntitlements.startDate])
                assertEquals(LocalDate.of(2025, 2, 1), it[UserEntitlements.endDate])
                assertEquals(95, it[UserEntitlements.regionId].value)
                assertEquals(true, it[UserEntitlements.revoked])
                assertNotNull(it[UserEntitlements.lastUpdated])
            }
        }
    }

    @Test
    fun `POST returns a successful response and existing cards are revoked when the user entitlement has been revoked`() = JavalinTest.test(app) { _, client ->
        TestData.createApiToken(creatorId = admin.id, type = ApiTokenType.USER_IMPORT)
        val entitlementId = TestData.createUserEntitlement(
            userHash = TEST_USER_HASH,
            regionId = 1
        )
        val dynamicCardId = TestData.createDynamicCard(entitlementId = entitlementId)
        val staticCardId = TestData.createStaticCard(entitlementId = entitlementId)

        val csvFile = generateCsvFile(
            TEST_CSV_FILE_PATH,
            listOf("regionKey", "userHash", "startDate", "endDate", "revoked"),
            listOf("07111", "\"$TEST_USER_HASH\"", "01.02.2024", "01.02.2025", "true")
        )
        val response = importUsers(client, csvFile)

        assertEquals(200, response.code)

        val jsonResponse = jacksonObjectMapper().readTree(response.body?.string())

        assertEquals("Import successfully completed", jsonResponse["message"].asText())

        transaction {
            assertTrue(CardEntity.find { Cards.id eq dynamicCardId }.single().revoked)
            assertTrue(CardEntity.find { Cards.id eq staticCardId }.single().revoked)
        }
    }

    private fun importUsers(client: HttpClient, csvFile: File?, token: String? = "dummy"): Response {
        val requestBuilder = Request.Builder().url(client.origin + USER_IMPORT_PATH)
        if (token != null) {
            requestBuilder.addHeader("Authorization", "Bearer $token")
        }
        if (csvFile != null) {
            val requestBody = MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart(
                    "file",
                    "test.csv",
                    csvFile.asRequestBody("text/csv".toMediaTypeOrNull())
                )
                .build()
            requestBuilder.post(requestBody)
        } else {
            requestBuilder.post(byteArrayOf().toRequestBody(null))
        }
        return client.request(requestBuilder.build())
    }
}
