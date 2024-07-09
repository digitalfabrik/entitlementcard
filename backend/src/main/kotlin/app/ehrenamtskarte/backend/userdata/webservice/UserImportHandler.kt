package app.ehrenamtskarte.backend.userdata.webservice

import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.userdata.database.UserEntitlementsRepository
import app.ehrenamtskarte.backend.userdata.exception.UserImportException
import io.javalin.http.Context
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVParser
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.io.BufferedReader
import java.io.InputStreamReader
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException

class UserImportHandler {

    private val logger: Logger = LoggerFactory.getLogger(UserImportHandler::class.java)

    fun handle(ctx: Context) {
        try {
            // TODO as part of #1417:
            // validate auth token, check to which project it belongs, check if this project is allowed to send user data
            // (should be added as a flag in config.yml), save projectId into val for the later use, else return an error
            val files = ctx.uploadedFiles("file")
            when {
                files.isEmpty() -> throw UserImportException("No file uploaded")
                files.size > 1 -> throw UserImportException("Multiple files uploaded")
            }
            val file = files[0]

            BufferedReader(InputStreamReader(file.content())).use { reader ->
                getCSVParser(reader).use { csvParser ->
                    importData(csvParser)
                }
            }
            ctx.status(200).result("Import successfully completed")
        } catch (exception: UserImportException) {
            ctx.status(400).result(exception.message ?: "Import failed")
        } catch (exception: Exception) {
            logger.error("Failed to perform user import", exception)
            ctx.status(500).result("Internal error occurred")
        }
    }

    private fun getCSVParser(reader: BufferedReader): CSVParser {
        return CSVParser(
            reader,
            CSVFormat.DEFAULT.builder()
                .setHeader()
                .setTrim(true)
                .setSkipHeaderRecord(true)
                .build()
        )
    }

    private fun importData(csvParser: CSVParser) {
        val headers = csvParser.headerMap.keys
        val requiredColumns = setOf("userHash", "startDate", "endDate", "revoked")
        if (!headers.containsAll(requiredColumns)) {
            throw UserImportException("Missing required columns: ${requiredColumns - headers}")
        }

        transaction {
            // TODO as part of #1417: use projectId defined from the auth token
            val project = ProjectEntity.find { Projects.project eq "showcase.entitlementcard.app" }.single()

            for (entry in csvParser) {
                if (entry.toMap().size != csvParser.headerMap.size) {
                    throw UserImportException(entry.recordNumber, "Missing data")
                }

                val userHash = entry.get("userHash").toByteArray()
                if (!isValidUserHash(userHash)) {
                    throw UserImportException(entry.recordNumber, "Failed to validate userHash")
                }

                val startDate = parseDate(entry.get("startDate"), entry.recordNumber)
                val endDate = parseDate(entry.get("endDate"), entry.recordNumber)
                if (startDate.isAfter(endDate)) {
                    throw UserImportException(entry.recordNumber, "Start date cannot be after end date")
                }

                val revoked = entry.get("revoked").toBoolean()

                UserEntitlementsRepository.insertOrUpdateUserData(
                    userHash,
                    startDate,
                    endDate,
                    revoked,
                    project.id.value
                )
            }
        }
    }

    private fun isValidUserHash(userHash: ByteArray): Boolean {
        // TODO implement userHash validation after #1433
        return true
    }

    private fun parseDate(dateString: String, lineNumber: Long): LocalDate {
        try {
            return LocalDate.parse(dateString, DateTimeFormatter.ofPattern("dd.MM.yyyy"))
        } catch (exception: DateTimeParseException) {
            throw UserImportException(lineNumber, "Failed to parse date [$dateString]. Expected format: dd.MM.yyyy")
        }
    }
}
