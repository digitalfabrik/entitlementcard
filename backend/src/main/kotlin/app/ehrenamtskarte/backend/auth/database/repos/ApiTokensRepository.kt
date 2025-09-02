package app.ehrenamtskarte.backend.auth.database.repos

import app.ehrenamtskarte.backend.db.entities.ApiTokenEntity
import app.ehrenamtskarte.backend.db.entities.ApiTokenType
import app.ehrenamtskarte.backend.db.entities.ApiTokens
import org.jetbrains.exposed.dao.id.EntityID
import java.time.LocalDate

object ApiTokensRepository {
    fun insert(
        tokenHash: ByteArray,
        adminId: EntityID<Int>,
        expirationDate: LocalDate,
        projectId: EntityID<Int>,
        type: ApiTokenType,
    ): ApiTokenEntity =
        ApiTokenEntity.new {
            this.tokenHash = tokenHash
            this.creator = adminId
            this.expirationDate = expirationDate
            this.projectId = projectId
            this.type = type
        }

    fun findByTokenHash(tokenHash: ByteArray): ApiTokenEntity? =
        ApiTokenEntity.find {
            (ApiTokens.tokenHash eq tokenHash)
        }.singleOrNull()
}
