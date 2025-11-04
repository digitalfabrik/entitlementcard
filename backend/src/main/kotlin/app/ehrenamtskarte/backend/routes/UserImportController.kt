package app.ehrenamtskarte.backend.routes

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.db.entities.ApiTokenType
import app.ehrenamtskarte.backend.db.entities.ProjectEntity
import app.ehrenamtskarte.backend.db.entities.Projects
import app.ehrenamtskarte.backend.db.repositories.CardRepository
import app.ehrenamtskarte.backend.db.repositories.RegionsRepository
import app.ehrenamtskarte.backend.db.repositories.UserEntitlementsRepository
import app.ehrenamtskarte.backend.routes.exception.UserImportException
import app.ehrenamtskarte.backend.shared.TokenAuthenticator
import app.ehrenamtskarte.backend.shared.crypto.Argon2IdHasher
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVParser
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.reactive.function.server.ServerRequest
import java.io.BufferedReader
import java.io.InputStreamReader
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException

@RestController
@RequestMapping("/users/import")
class UserImportController(
    private val config: BackendConfiguration,
) {
    @PostMapping(consumes = [MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_FORM_URLENCODED_VALUE])
    @Operation(
        summary = "Imports user data from a CSV file",
    )
    fun handleUserImport(
        @Parameter(
            description = "CSV file with user information",
            example = """
    
        regionKey,userHash,startDate,endDate,revoked
        07111,hashedUser1,01.01.2022,31.12.2022,false
        07111,hashedUser2,01.06.2022,31.05.2023,true
    """,
        )
        @RequestParam("file", required = false) files: List<MultipartFile>?,
        request: ServerRequest,
    ): ResponseEntity<Map<String, String>> {
        when {
            files.isNullOrEmpty() -> throw UserImportException("No file uploaded")
            files.size > 1 -> throw UserImportException("Multiple files uploaded")
        }
        val file = files.single()

        val apiToken = TokenAuthenticator.authenticate(
            request.headers().firstHeader("Authorization"),
            ApiTokenType.USER_IMPORT
        )
        val project = transaction { ProjectEntity.find { Projects.id eq apiToken.projectId }.single() }
        val projectConfig = config.getProjectConfig(project.project)

        if (!projectConfig.selfServiceEnabled) {
            throw UserImportException("User import is not enabled for this project")
        }

        BufferedReader(InputStreamReader(file.inputStream)).use { reader ->
            getCSVParser(reader).use { csvParser ->
                validateHeaders(csvParser.headerNames)
                importData(csvParser, project.project)
            }
        }

        return ResponseEntity.ok(mapOf("message" to "Import successfully completed"))
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
        } catch (_: DateTimeParseException) {
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
