package app.ehrenamtskarte.backend.userdata.database

import org.jetbrains.exposed.sql.booleanLiteral
import org.jetbrains.exposed.sql.javatime.dateLiteral
import org.jetbrains.exposed.sql.javatime.timestampLiteral
import org.jetbrains.exposed.sql.upsert
import java.time.Instant
import java.time.LocalDate

object UserEntitlementsRepository {

    fun insertOrUpdateUserData(userHash: ByteArray, startDate: LocalDate, endDate: LocalDate, revoked: Boolean, projectId: Int) {
        UserEntitlements.upsert(
            UserEntitlements.userHash,
            UserEntitlements.projectId,
            onUpdate = listOf(
                UserEntitlements.startDate to dateLiteral(startDate),
                UserEntitlements.endDate to dateLiteral(endDate),
                UserEntitlements.revoked to booleanLiteral(revoked),
                UserEntitlements.lastUpdated to timestampLiteral(Instant.now())
            )
        ) {
            it[UserEntitlements.userHash] = userHash
            it[UserEntitlements.startDate] = startDate
            it[UserEntitlements.endDate] = endDate
            it[UserEntitlements.revoked] = revoked
            it[UserEntitlements.projectId] = projectId
        }
    }
}
