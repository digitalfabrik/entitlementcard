package app.ehrenamtskarte.backend.userdata.database

import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.update
import java.time.Instant
import java.time.LocalDate

object UserEntitlementsRepository {
    fun insert(
        userHash: ByteArray,
        startDate: LocalDate,
        endDate: LocalDate,
        revoked: Boolean,
        regionId: Int,
    ) {
        UserEntitlements.insert {
            it[UserEntitlements.userHash] = userHash
            it[UserEntitlements.startDate] = startDate
            it[UserEntitlements.endDate] = endDate
            it[UserEntitlements.revoked] = revoked
            it[UserEntitlements.regionId] = regionId
            it[lastUpdated] = Instant.now()
        }
    }

    fun update(
        userHash: ByteArray,
        startDate: LocalDate,
        endDate: LocalDate,
        revoked: Boolean,
        regionId: Int,
    ) {
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
}
