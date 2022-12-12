package app.ehrenamtskarte.backend.verification.database.repos

import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.regions.database.Regions
import app.ehrenamtskarte.backend.verification.database.CardEntity
import app.ehrenamtskarte.backend.verification.database.Cards
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.select
import java.time.Instant

object CardRepository {

    fun findByHashModel(project: String, hashModel: ByteArray): CardEntity? {
        val query = (Projects innerJoin Regions innerJoin Cards)
            .slice(Cards.columns)
            .select { Projects.project eq project and (Cards.cardDetailsHash eq hashModel) }
            .singleOrNull()
        return if (query == null) null else CardEntity.wrapRow(query)
    }

    fun insert(cardDetailsHash: ByteArray, totpSecret: ByteArray, expirationDay: Long?, regionId: Int) =
        CardEntity.new {
            this.cardDetailsHash = cardDetailsHash
            this.totpSecret = totpSecret
            this.expirationDay = expirationDay
            this.issueDate = Instant.now()
            this.regionId = EntityID(regionId, Regions)
            this.revoked = false
        }
}
