package app.ehrenamtskarte.backend.userdata.webservice

import app.ehrenamtskarte.backend.cards.Argon2IdHasher
import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.db.entities.ApiTokenType
import app.ehrenamtskarte.backend.db.entities.ProjectEntity
import app.ehrenamtskarte.backend.db.entities.Projects
import app.ehrenamtskarte.backend.db.repositories.CardRepository
import app.ehrenamtskarte.backend.db.repositories.RegionsRepository
import app.ehrenamtskarte.backend.db.repositories.UserEntitlementsRepository
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.ProjectNotFoundException
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.graphql.auth.TokenAuthenticator
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

class UserImportHandler(
    private val backendConfiguration: BackendConfiguration,
) {
    private val logger: Logger = LoggerFactory.getLogger(UserImportHandler::class.java)

    fun handle(context: Context) {
        try {
            val apiToken = TokenAuthenticator.authenticate(context, ApiTokenType.USER_IMPORT)

            val project = transaction { ProjectEntity.find { Projects.id eq apiToken.projectId }.single() }
            val projectConfig = backendConfiguration.getProjectConfig(project.project)

            if (!projectConfig.selfServiceEnabled) {
                throw UserImportException("User import is not enabled in the project")
            }

            val files = context.uploadedFiles("file")
            when {
                files.isEmpty() -> throw UserImportException("No file uploaded")
                files.size > 1 -> throw UserImportException("Multiple files uploaded")
            }
            val file = files[0]

            BufferedReader(InputStreamReader(file.content())).use { reader ->
                getCSVParser(reader).use { csvParser ->
                    validateHeaders(csvParser.headerNames)
                    importData(csvParser, project.project)
                }
            }
            context.status(200).json(mapOf("message" to "Import successfully completed"))
        } catch (exception: UserImportException) {
            context.status(400).json(mapOf("message" to exception.message))
        } catch (exception: UnauthorizedException) {
            context.status(401).json(mapOf("message" to exception.message))
        } catch (exception: ForbiddenException) {
            context.status(403).json(mapOf("message" to exception.message))
        } catch (exception: ProjectNotFoundException) {
            context.status(404).json(mapOf("message" to exception.message))
        } catch (exception: Exception) {
            logger.error("Failed to perform user import", exception)
            context.status(500).json(mapOf("message" to "Internal error occurred"))
        }
    }

    private fun getCSVParser(reader: BufferedReader): CSVParser =
        CSVParser.builder().apply {
            this.reader = reader
            this.setFormat(
                CSVFormat.DEFAULT.builder()
                    .setHeader()
                    .setTrim(true)
                    .setSkipHeaderRecord(true)
                    .get(),
            )
        }.get()

    private fun validateHeaders(headers: List<String>) {
        val requiredColumns = setOf("regionKey", "userHash", "startDate", "endDate", "revoked")
        if (!headers.containsAll(requiredColumns)) {
            throw UserImportException("Missing required columns: ${requiredColumns - headers.toSet()}")
        }
    }

    private fun importData(csvParser: CSVParser, project: String) {
        transaction {
            val regionsByProject = RegionsRepository.findAllInProject(project)

            for (entry in csvParser) {
                if (entry.toMap().size != csvParser.headerMap.size) {
                    throw UserImportException(entry.recordNumber, "Missing data")
                }

                val region = regionsByProject.singleOrNull { it.regionIdentifier == entry.get("regionKey") }
                    ?: throw UserImportException(
                        entry.recordNumber,
                        "Specified region not found for the current project",
                    )

                val userHash = entry.get("userHash")
                if (!Argon2IdHasher.isValidUserHash(userHash)) {
                    throw UserImportException(entry.recordNumber, "Failed to validate userHash")
                }

                val startDate = parseDate(entry.get("startDate"), entry.recordNumber)
                val endDate = parseDate(entry.get("endDate"), entry.recordNumber)
                if (startDate.isAfter(endDate)) {
                    throw UserImportException(
                        entry.recordNumber,
                        "Start date cannot be after end date",
                    )
                }

                val revoked = parseRevoked(entry.get("revoked"), entry.recordNumber)

                upsertUserEntitlement(userHash, startDate, endDate, revoked, region.id.value)
            }
        }
    }

    private fun parseDate(dateString: String, lineNumber: Long): LocalDate {
        try {
            return LocalDate.parse(dateString, DateTimeFormatter.ofPattern("dd.MM.yyyy"))
        } catch (exception: DateTimeParseException) {
            throw UserImportException(
                lineNumber,
                "Failed to parse date [$dateString]. Expected format: dd.MM.yyyy",
            )
        }
    }

    private fun parseRevoked(revokedString: String, lineNumber: Long): Boolean =
        revokedString.toBooleanStrictOrNull()
            ?: throw UserImportException(lineNumber, "Revoked must be a boolean value")

    private fun upsertUserEntitlement(
        userHash: String,
        startDate: LocalDate,
        endDate: LocalDate,
        revoked: Boolean,
        regionId: Int,
    ) {
        val userEntitlement = UserEntitlementsRepository.findByUserHash(userHash.toByteArray())
        if (userEntitlement == null) {
            UserEntitlementsRepository.insert(
                userHash.toByteArray(),
                startDate,
                endDate,
                revoked,
                regionId,
            )
        } else {
            UserEntitlementsRepository.update(
                userHash.toByteArray(),
                startDate,
                endDate,
                revoked,
                regionId,
            )
            if (revoked) {
                CardRepository.revokeByEntitlementId(userEntitlement.id.value)
            }
        }
    }
}
