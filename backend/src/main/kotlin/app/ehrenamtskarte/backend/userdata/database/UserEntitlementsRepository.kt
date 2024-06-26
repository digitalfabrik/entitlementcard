package app.ehrenamtskarte.backend.userdata.database

import org.jetbrains.exposed.sql.booleanLiteral
import org.jetbrains.exposed.sql.javatime.timestampLiteral
import org.jetbrains.exposed.sql.upsert
import java.time.Instant

object UserEntitlementsRepository {

    fun insertOrUpdateUserData(userHash: ByteArray, startDate: Instant, endDate: Instant, revoked: Boolean, projectId: Int) {
        UserEntitlements.upsert(
            UserEntitlements.userHash,
            UserEntitlements.projectId,
            onUpdate = listOf(
                UserEntitlements.startDate to timestampLiteral(startDate),
                UserEntitlements.endDate to timestampLiteral(endDate),
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
