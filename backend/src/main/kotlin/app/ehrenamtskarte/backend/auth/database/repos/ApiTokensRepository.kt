package app.ehrenamtskarte.backend.auth.database.repos

import app.ehrenamtskarte.backend.auth.database.ApiTokenEntity
import app.ehrenamtskarte.backend.auth.database.ApiTokens
import org.jetbrains.exposed.dao.id.EntityID
import java.time.LocalDate

object ApiTokensRepository {
    fun insert(
        tokenHash: ByteArray,
        adminId: EntityID<Int>,
        expirationDate: LocalDate,
        projectId: EntityID<Int>
    ): ApiTokenEntity {
        return ApiTokenEntity.new {
            this.tokenHash = tokenHash
            this.creator = adminId
            this.expirationDate = expirationDate
            this.projectId = projectId
        }
    }

    fun findByTokenHash(tokenHash: ByteArray): ApiTokenEntity? {
        return ApiTokenEntity.find { (ApiTokens.tokenHash eq tokenHash) }.singleOrNull()
    }
}
