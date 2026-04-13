package app.ehrenamtskarte.backend.routes

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.db.entities.ApiTokenType
import app.ehrenamtskarte.backend.db.entities.Cards
import app.ehrenamtskarte.backend.db.entities.ProjectEntity
import app.ehrenamtskarte.backend.db.entities.Projects
import app.ehrenamtskarte.backend.db.entities.Regions
import app.ehrenamtskarte.backend.db.entities.UserEntitlements
import app.ehrenamtskarte.backend.routes.exception.UserImportException
import app.ehrenamtskarte.backend.shared.TokenAuthenticator
import app.ehrenamtskarte.backend.shared.crypto.Argon2IdHasher
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import jakarta.servlet.http.HttpServletRequest
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVParser
import org.apache.commons.csv.CSVRecord
import org.jetbrains.exposed.v1.core.and
import org.jetbrains.exposed.v1.core.dao.id.EntityID
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.core.inList
import org.jetbrains.exposed.v1.core.inSubQuery
import org.jetbrains.exposed.v1.jdbc.batchUpsert
import org.jetbrains.exposed.v1.jdbc.select
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.jetbrains.exposed.v1.jdbc.update
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import java.time.Instant
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
        request: HttpServletRequest,
    ): ResponseEntity<Map<String, String>> {
        val file = when {
            files.isNullOrEmpty() -> throw UserImportException("No file uploaded")
            files.size > 1 -> throw UserImportException("Multiple files uploaded")
            else -> files.first()
        }
        val apiToken = TokenAuthenticator.authenticate(request, ApiTokenType.USER_IMPORT)
        val project =
            transaction { ProjectEntity.findById(apiToken.projectId) } ?: throw UserImportException("Project not found")

        if (!config.getProjectConfig(project.project).selfServiceEnabled) {
            throw UserImportException("User import is not enabled for this project")
        }

        parseCsvFile(file) { csvParser ->
            if (!csvParser.headerNames.containsAll(requiredUserImportColumns)) {
                throw UserImportException(
                    "Missing required columns: ${requiredUserImportColumns - csvParser.headerNames.toSet()}",
                )
            }

            transaction {
                unregisterInterceptor(this.defaultLogger)

                val now = Instant.now()
                val regionIdsByIdentifier: Map<String, EntityID<Int>> = (Projects innerJoin Regions)
                    .select(Regions.id, Regions.regionIdentifier)
                    .where(Projects.project eq project.project)
                    .associate { it[Regions.regionIdentifier] to it[Regions.id] }

                val revokedHashes = csvParser.chunked(1024).flatMap { csvRecords ->
                    val entries = csvRecords.map {
                        if (it.size() == csvParser.headerMap.size) {
                            CsvEntry.fromCsvRecord(it, regionIdsByIdentifier)
                        } else {
                            throw UserImportException(it.recordNumber, "Missing data")
                        }
                    }

                    // Check for duplicate user hashes, first do a coarse check with contentHashCode()
                    entries.groupBy { it.userHash.contentHashCode() }.forEach { (_, entries) ->
                        // Do an exact check with toList()
                        if (entries.size != entries.distinctBy { it.userHash.toList() }.size) {
                            throw UserImportException("Duplicate user hash found with ${entries.size} entries")
                        }
                    }

                    UserEntitlements.batchUpsert(
                        entries,
                        UserEntitlements.userHash,
                        onUpdateExclude = listOf(UserEntitlements.userHash),
                        shouldReturnGeneratedValues = false,
                    ) {
                        this[UserEntitlements.userHash] = it.userHash
                        this[UserEntitlements.startDate] = it.startDate
                        this[UserEntitlements.endDate] = it.endDate
                        this[UserEntitlements.revoked] = it.revoked
                        this[UserEntitlements.regionId] = it.regionId
                        this[UserEntitlements.lastUpdated] = now
                    }

                    entries.mapNotNull { if (it.revoked) it.userHash else null }
                }

                revokedHashes.chunked(4096).forEach { chunk ->
                    Cards.update(
                        where = {
                            (
                                Cards.entitlementId inSubQuery UserEntitlements
                                    .select(UserEntitlements.id)
                                    .where { UserEntitlements.userHash inList chunk }
                            ) and (Cards.revoked eq false)
                        },
                    ) {
                        it[revoked] = true
                    }
                }
            }
        }

        return ResponseEntity.ok(mapOf("message" to "Import successfully completed"))
    }
}

private fun parseDate(dateString: String, lineNumber: Long): LocalDate =
    try {
        LocalDate.parse(dateString, DateTimeFormatter.ofPattern("dd.MM.yyyy"))
    } catch (_: DateTimeParseException) {
        throw UserImportException(
            lineNumber,
            "Failed to parse date [$dateString]. Expected format: dd.MM.yyyy",
        )
    }

private fun parseRevoked(revokedString: String, lineNumber: Long): Boolean =
    revokedString.toBooleanStrictOrNull()
        ?: throw UserImportException(lineNumber, "Revoked must be a boolean value")

private data class CsvEntry(
    val regionId: EntityID<Int>,
    val userHash: ByteArray,
    val startDate: LocalDate,
    val endDate: LocalDate,
    val revoked: Boolean,
) {
    companion object {
        fun fromCsvRecord(record: CSVRecord, regionIdsByIdentifier: Map<String, EntityID<Int>>): CsvEntry {
            val startDate = parseDate(record.get("startDate"), record.recordNumber)
            val endDate = parseDate(record.get("endDate"), record.recordNumber)

            if (startDate.isAfter(endDate)) {
                throw UserImportException(
                    record.recordNumber,
                    "Start date cannot be after end date",
                )
            }

            return CsvEntry(
                userHash = record.get("userHash").let {
                    if (!Argon2IdHasher.isValidUserHash(it)) {
                        throw UserImportException(record.recordNumber, "Failed to validate userHash")
                    } else {
                        it.toByteArray()
                    }
                },
                regionId = regionIdsByIdentifier[record.get("regionKey")]
                    ?: throw UserImportException(
                        record.recordNumber,
                        "Specified region not found for the current project",
                    ),
                startDate = startDate,
                endDate = endDate,
                revoked = parseRevoked(record.get("revoked"), record.recordNumber),
            )
        }
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as CsvEntry

        if (revoked != other.revoked) return false
        if (regionId != other.regionId) return false
        if (!userHash.contentEquals(other.userHash)) return false
        if (startDate != other.startDate) return false
        if (endDate != other.endDate) return false

        return true
    }

    override fun hashCode(): Int {
        var result = revoked.hashCode()
        result = 31 * result + regionId.hashCode()
        result = 31 * result + userHash.contentHashCode()
        result = 31 * result + startDate.hashCode()
        result = 31 * result + endDate.hashCode()
        return result
    }
}

private val requiredUserImportColumns = setOf("regionKey", "userHash", "startDate", "endDate", "revoked")

private fun parseCsvFile(file: MultipartFile, fn: (CSVParser) -> Unit) =
    file.inputStream.reader().buffered().use { reader ->
        CSVParser.builder().apply {
            this.reader = reader
            this.setFormat(
                CSVFormat.DEFAULT.builder()
                    .setHeader()
                    .setTrim(true)
                    .setSkipHeaderRecord(true)
                    .get(),
            )
        }.get().use { fn(it) }
    }
