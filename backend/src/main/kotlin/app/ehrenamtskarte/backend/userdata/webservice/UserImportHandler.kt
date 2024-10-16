package app.ehrenamtskarte.backend.userdata.webservice

import app.ehrenamtskarte.backend.auth.database.ApiTokenEntity
import app.ehrenamtskarte.backend.auth.database.PasswordCrypto
import app.ehrenamtskarte.backend.auth.database.repos.ApiTokensRepository
import app.ehrenamtskarte.backend.cards.Argon2IdHasher
import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.ProjectNotFoundException
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.regions.database.Regions
import app.ehrenamtskarte.backend.userdata.database.UserEntitlementsRepository
import app.ehrenamtskarte.backend.userdata.exception.UserImportException
import io.javalin.http.Context
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVParser
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.io.BufferedReader
import java.io.InputStreamReader
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException

class UserImportHandler(
    private val backendConfiguration: BackendConfiguration
) {
    private val logger: Logger = LoggerFactory.getLogger(UserImportHandler::class.java)

    fun handle(ctx: Context) {
        try {
            val apiToken = authenticate(ctx)

            val project = transaction { ProjectEntity.find { Projects.id eq apiToken.projectId }.single() }
            val projectConfig = backendConfiguration.getProjectConfig(project.project)

            if (!projectConfig.selfServiceEnabled) {
                throw UserImportException("User import is not enabled in the project")
            }

            val files = ctx.uploadedFiles("file")
            when {
                files.isEmpty() -> throw UserImportException("No file uploaded")
                files.size > 1 -> throw UserImportException("Multiple files uploaded")
            }
            val file = files[0]

            BufferedReader(InputStreamReader(file.content())).use { reader ->
                getCSVParser(reader).use { csvParser ->
                    importData(csvParser, project.id.value)
                }
            }
            ctx.status(200).json(mapOf("message" to "Import successfully completed"))
        } catch (exception: UserImportException) {
            ctx.status(400).json(mapOf("message" to exception.message))
        } catch (exception: UnauthorizedException) {
            ctx.status(401).json(mapOf("message" to exception.message))
        } catch (exception: ForbiddenException) {
            ctx.status(403).json(mapOf("message" to exception.message))
        } catch (exception: ProjectNotFoundException) {
            ctx.status(404).json(mapOf("message" to exception.message))
        } catch (exception: Exception) {
            logger.error("Failed to perform user import", exception)
            ctx.status(500).json(mapOf("message" to "Internal error occurred"))
        }
    }

    private fun authenticate(ctx: Context): ApiTokenEntity {
        val authHeader = ctx.header("Authorization")?.takeIf { it.startsWith("Bearer ") }
            ?: throw UnauthorizedException()
        val tokenHash = PasswordCrypto.hashWithSHA256(authHeader.substring(7).toByteArray())

        return transaction {
            ApiTokensRepository.findByTokenHash(tokenHash)?.takeIf { it.expirationDate > LocalDate.now() }
                ?: throw ForbiddenException()
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

    private fun importData(csvParser: CSVParser, projectId: Int) {
        val headers = csvParser.headerMap.keys
        val requiredColumns = setOf("regionKey", "userHash", "startDate", "endDate", "revoked")
        if (!headers.containsAll(requiredColumns)) {
            throw UserImportException("Missing required columns: ${requiredColumns - headers}")
        }

        transaction {
            val regionsByProject = Regions.select { Regions.projectId eq projectId }
                .associate { it[Regions.regionIdentifier] to it[Regions.id].value }

            for (entry in csvParser) {
                if (entry.toMap().size != csvParser.headerMap.size) {
                    throw UserImportException(entry.recordNumber, "Missing data")
                }

                val regionId = regionsByProject[entry.get("regionKey")]
                    ?: throw UserImportException(entry.recordNumber, "Specified region not found for the current project")

                val userHash = entry.get("userHash")
                if (!Argon2IdHasher.isValidUserHash(userHash)) {
                    throw UserImportException(entry.recordNumber, "Failed to validate userHash")
                }

                val startDate = parseDate(entry.get("startDate"), entry.recordNumber)
                val endDate = parseDate(entry.get("endDate"), entry.recordNumber)
                if (startDate.isAfter(endDate)) {
                    throw UserImportException(entry.recordNumber, "Start date cannot be after end date")
                }

                val revoked = entry.get("revoked").toBooleanStrictOrNull()
                    ?: throw UserImportException(entry.recordNumber, "Revoked must be a boolean value")

                UserEntitlementsRepository.insertOrUpdateUserData(
                    userHash.toByteArray(),
                    startDate,
                    endDate,
                    revoked,
                    regionId
                )
            }
        }
    }

    private fun parseDate(dateString: String, lineNumber: Long): LocalDate {
        try {
            return LocalDate.parse(dateString, DateTimeFormatter.ofPattern("dd.MM.yyyy"))
        } catch (exception: DateTimeParseException) {
            throw UserImportException(lineNumber, "Failed to parse date [$dateString]. Expected format: dd.MM.yyyy")
        }
    }
}
