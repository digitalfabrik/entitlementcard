package app.ehrenamtskarte.backend.db.repositories

import app.ehrenamtskarte.backend.db.entities.UserEntitlements
import app.ehrenamtskarte.backend.db.entities.UserEntitlementsEntity
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.jdbc.batchUpsert
import org.jetbrains.exposed.v1.jdbc.insert
import org.jetbrains.exposed.v1.jdbc.update
import java.time.Instant
import java.time.LocalDate

data class UserEntitlementImportEntry(
    val userHash: ByteArray,
    val startDate: LocalDate,
    val endDate: LocalDate,
    val revoked: Boolean,
    val regionId: Int,
)

object UserEntitlementsRepository {
    private const val BATCH_SIZE = 1000

    fun insert(userHash: ByteArray, startDate: LocalDate, endDate: LocalDate, revoked: Boolean, regionId: Int) {
        UserEntitlements.insert {
            it[UserEntitlements.userHash] = userHash
            it[UserEntitlements.startDate] = startDate
            it[UserEntitlements.endDate] = endDate
            it[UserEntitlements.revoked] = revoked
            it[UserEntitlements.regionId] = regionId
            it[lastUpdated] = Instant.now()
        }
    }

    fun update(userHash: ByteArray, startDate: LocalDate, endDate: LocalDate, revoked: Boolean, regionId: Int) {
        UserEntitlements.update({ UserEntitlements.userHash eq userHash }) {
            it[UserEntitlements.startDate] = startDate
            it[UserEntitlements.endDate] = endDate
            it[UserEntitlements.revoked] = revoked
            it[UserEntitlements.regionId] = regionId
            it[lastUpdated] = Instant.now()
        }
    }

    fun findByUserHash(userHash: ByteArray): UserEntitlementsEntity? =
        UserEntitlementsEntity.find {
            UserEntitlements.userHash eq userHash
        }.firstOrNull()

    fun batchUpsert(entries: List<UserEntitlementImportEntry>) {
        if (entries.isEmpty()) return
        val now = Instant.now()
        // Chunk to stay below PostgreSQL's 65535 bind-parameter limit (6 columns × 1000 rows = 6000)
        entries.chunked(BATCH_SIZE).forEach { chunk ->
            UserEntitlements.batchUpsert(
                data = chunk,
                keys = arrayOf(UserEntitlements.userHash),
                shouldReturnGeneratedValues = false,
            ) { entry ->
                this[UserEntitlements.userHash] = entry.userHash
                this[UserEntitlements.startDate] = entry.startDate
                this[UserEntitlements.endDate] = entry.endDate
                this[UserEntitlements.revoked] = entry.revoked
                this[UserEntitlements.regionId] = entry.regionId
                this[UserEntitlements.lastUpdated] = now
            }
        }
    }
}
