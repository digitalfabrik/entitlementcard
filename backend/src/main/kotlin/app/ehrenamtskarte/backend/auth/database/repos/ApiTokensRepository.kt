package app.ehrenamtskarte.backend.auth.database.repos

import app.ehrenamtskarte.backend.auth.database.ApiTokenEntity
import org.jetbrains.exposed.dao.id.EntityID
import java.time.LocalDate

object ApiTokensRepository {
    fun insert(
        token: ByteArray,
        adminId: EntityID<Int>,
        expirationDate: LocalDate,
        projectId: EntityID<Int>
    ): ApiTokenEntity {
        return ApiTokenEntity.new {
            this.token = token
            this.creator = adminId
            this.expirationDate = expirationDate
            this.projectId = projectId
        }
    }
}
