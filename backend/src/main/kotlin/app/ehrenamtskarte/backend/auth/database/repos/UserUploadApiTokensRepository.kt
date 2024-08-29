package app.ehrenamtskarte.backend.auth.database.repos

import app.ehrenamtskarte.backend.auth.database.UserUploadApiTokenEntity
import org.jetbrains.exposed.dao.id.EntityID
import java.time.LocalDate

object UserUploadApiTokensRepository {
    fun insert(
        token: ByteArray,
        adminId: EntityID<Int>,
        expirationDate: LocalDate,
        projectId: EntityID<Int>
    ): UserUploadApiTokenEntity {
        return UserUploadApiTokenEntity.new {
            this.token = token
            this.creator = adminId
            this.expirationDate = expirationDate
            this.projectId = projectId
        }
    }
}
