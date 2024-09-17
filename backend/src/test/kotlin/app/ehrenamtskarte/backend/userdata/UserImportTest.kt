package app.ehrenamtskarte.backend.userdata

import app.ehrenamtskarte.backend.IntegrationTest
import app.ehrenamtskarte.backend.helper.TestData
import app.ehrenamtskarte.backend.userdata.database.UserEntitlements
import app.ehrenamtskarte.backend.userdata.webservice.UserImportHandler
import app.ehrenamtskarte.backend.util.CsvGenerator.generateCsvFile
import io.javalin.Javalin
import io.javalin.testtools.HttpClient
import io.javalin.testtools.JavalinTest
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.Request
import okhttp3.RequestBody.Companion.asRequestBody
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Test
import java.io.File
import java.time.LocalDate
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

private const val USER_IMPORT_PATH = "/users/import"
private const val TEST_CSV_FILE_PATH = "build/tmp/test.csv"
private const val TEST_USER_HASH = "\$argon2id\$v=19\$m=19456,t=2,p=1\$57YPIKvU/XE9h7/JA0tZFT2TzpwBQfYAW6K+ojXBh5w"

internal class UserImportTest : IntegrationTest() {

    private val app = Javalin.create().post(USER_IMPORT_PATH) { ctx -> UserImportHandler().handle(ctx) }

    @AfterEach
    fun cleanUp() {
        transaction {
            UserEntitlements.deleteAll()
        }
    }

    @Test
    fun `POST returns an error response when no file uploaded`() = JavalinTest.test(app) { _, client ->
        val response = client.post(USER_IMPORT_PATH)

        assertEquals(400, response.code)
        assertEquals("No file uploaded", response.body?.string())
    }

    @Test
    fun `POST returns an error response when multiple files uploaded`() = JavalinTest.test(app) { _, client ->
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
            .post(requestBody)
            .build()

        val response = client.request(request)

        assertEquals(400, response.code)
        assertEquals("Multiple files uploaded", response.body?.string())
    }

    @Test
    fun `POST returns an error response when required columns are missing`() = JavalinTest.test(app) { _, client ->
        val csvFile = generateCsvFile(TEST_CSV_FILE_PATH, listOf("regionKey", "revoked"))

        val request = buildUserImportRequest(client, csvFile)
        val response = client.request(request)

        assertEquals(400, response.code)
        assertEquals("Missing required columns: [userHash, startDate, endDate]", response.body?.string())

        transaction {
            assertEquals(0, UserEntitlements.selectAll().count())
        }
    }

    @Test
    fun `POST returns an error response when some data is missing`() = JavalinTest.test(app) { _, client ->
        val csvFile = generateCsvFile(
            TEST_CSV_FILE_PATH,
            listOf("regionKey", "userHash", "startDate", "endDate", "revoked"),
            listOf("01.01.2024", "01.01.2025", "false")
        )

        val request = buildUserImportRequest(client, csvFile)
        val response = client.request(request)

        assertEquals(400, response.code)
        assertEquals("Error at line 1: Missing data", response.body?.string())

        transaction {
            assertEquals(0, UserEntitlements.selectAll().count())
        }
    }

    @Test
    fun `POST returns an error response when region not found`() = JavalinTest.test(app) { _, client ->
        val csvFile = generateCsvFile(
            TEST_CSV_FILE_PATH,
            listOf("regionKey", "userHash", "startDate", "endDate", "revoked"),
            listOf("12345", "\"$TEST_USER_HASH\"", "01.01.2024", "01.01.2025", "false")
        )

        val request = buildUserImportRequest(client, csvFile)
        val response = client.request(request)

        assertEquals(400, response.code)
        assertEquals("Error at line 1: Specified region not found for the current project", response.body?.string())

        transaction {
            assertEquals(0, UserEntitlements.selectAll().count())
        }
    }

    @Test
    fun `POST returns an error response when userHash is not valid`() = JavalinTest.test(app) { _, client ->
        val csvFile = generateCsvFile(
            TEST_CSV_FILE_PATH,
            listOf("regionKey", "userHash", "startDate", "endDate", "revoked"),
            listOf("07111", "UIOJZIsSL8vXcu", "01.01.2024", "01.01.2025", "false")
        )

        val request = buildUserImportRequest(client, csvFile)
        val response = client.request(request)

        assertEquals(400, response.code)
        assertEquals("Error at line 1: Failed to validate userHash", response.body?.string())

        transaction {
            assertEquals(0, UserEntitlements.selectAll().count())
        }
    }

    @Test
    fun `POST returns an error response when startDate has incorrect format`() = JavalinTest.test(app) { _, client ->
        val csvFile = generateCsvFile(
            TEST_CSV_FILE_PATH,
            listOf("regionKey", "userHash", "startDate", "endDate", "revoked"),
            listOf("07111", "\"$TEST_USER_HASH\"", "2024-01-01", "01.01.2025", "false")
        )

        val request = buildUserImportRequest(client, csvFile)
        val response = client.request(request)

        assertEquals(400, response.code)
        assertEquals(
            "Error at line 1: Failed to parse date [2024-01-01]. Expected format: dd.MM.yyyy",
            response.body?.string()
        )

        transaction {
            assertEquals(0, UserEntitlements.selectAll().count())
        }
    }

    @Test
    fun `POST returns an error response when endDate has incorrect format`() = JavalinTest.test(app) { _, client ->
        val csvFile = generateCsvFile(
            TEST_CSV_FILE_PATH,
            listOf("regionKey", "userHash", "startDate", "endDate", "revoked"),
            listOf("07111", "\"$TEST_USER_HASH\"", "01.01.2024", "2025-01-01", "false")
        )

        val request = buildUserImportRequest(client, csvFile)
        val response = client.request(request)

        assertEquals(400, response.code)
        assertEquals(
            "Error at line 1: Failed to parse date [2025-01-01]. Expected format: dd.MM.yyyy",
            response.body?.string()
        )

        transaction {
            assertEquals(0, UserEntitlements.selectAll().count())
        }
    }

    @Test
    fun `POST returns an error response when startDate is after endDate`() = JavalinTest.test(app) { _, client ->
        val csvFile = generateCsvFile(
            TEST_CSV_FILE_PATH,
            listOf("regionKey", "userHash", "startDate", "endDate", "revoked"),
            listOf("07111", "\"$TEST_USER_HASH\"", "01.01.2025", "01.01.2024", "false")
        )

        val request = buildUserImportRequest(client, csvFile)
        val response = client.request(request)

        assertEquals(400, response.code)
        assertEquals("Error at line 1: Start date cannot be after end date", response.body?.string())

        transaction {
            assertEquals(0, UserEntitlements.selectAll().count())
        }
    }

    @Test
    fun `POST returns an error response when revoked is not boolean`() = JavalinTest.test(app) { _, client ->
        val csvFile = generateCsvFile(
            TEST_CSV_FILE_PATH,
            listOf("regionKey", "userHash", "startDate", "endDate", "revoked"),
            listOf("07111", "\"$TEST_USER_HASH\"", "01.01.2024", "01.01.2025", "12345")
        )

        val request = buildUserImportRequest(client, csvFile)
        val response = client.request(request)

        assertEquals(400, response.code)
        assertEquals("Error at line 1: Revoked must be a boolean value", response.body?.string())

        transaction {
            assertEquals(0, UserEntitlements.selectAll().count())
        }
    }

    @Test
    fun `POST returns a successful response and new user entitlements are saved in db`() = JavalinTest.test(app) { _, client ->
        val csvFile = generateCsvFile(
            TEST_CSV_FILE_PATH,
            listOf("regionKey", "userHash", "startDate", "endDate", "revoked"),
            listOf("07111", "\"$TEST_USER_HASH\"", "01.01.2024", "01.01.2025", "false")
        )

        val request = buildUserImportRequest(client, csvFile)
        val response = client.request(request)

        assertEquals(200, response.code)
        assertEquals("Import successfully completed", response.body?.string())

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
        TestData.createUserEntitlements(
            userHash = TEST_USER_HASH,
            regionId = 1
        )

        val csvFile = generateCsvFile(
            TEST_CSV_FILE_PATH,
            listOf("regionKey", "userHash", "startDate", "endDate", "revoked"),
            listOf("07111", "\"$TEST_USER_HASH\"", "01.02.2024", "01.02.2025", "true")
        )

        val request = buildUserImportRequest(client, csvFile)
        val response = client.request(request)

        assertEquals(200, response.code)
        assertEquals("Import successfully completed", response.body?.string())

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

    private fun buildUserImportRequest(client: HttpClient, csvFile: File): Request {
        val requestBody = MultipartBody.Builder()
            .setType(MultipartBody.FORM)
            .addFormDataPart(
                "file",
                "test.csv",
                csvFile.asRequestBody("text/csv".toMediaTypeOrNull())
            )
            .build()

        return Request.Builder()
            .url(client.origin + USER_IMPORT_PATH)
            .post(requestBody)
            .build()
    }
}
