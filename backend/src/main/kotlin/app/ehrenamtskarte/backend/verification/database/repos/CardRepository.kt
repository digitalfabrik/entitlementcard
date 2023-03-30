package app.ehrenamtskarte.backend.verification.database.repos

import app.ehrenamtskarte.backend.auth.database.Administrators
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.regions.database.Regions
import app.ehrenamtskarte.backend.verification.database.CardEntity
import app.ehrenamtskarte.backend.verification.database.Cards
import app.ehrenamtskarte.backend.verification.database.CodeType
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.select
import java.time.Instant

object CardRepository {

    fun findByHash(project: String, cardInfoHash: ByteArray): CardEntity? {
        val query =
            (Projects innerJoin Regions innerJoin Cards)
                .slice(Cards.columns)
                .select {
                    Projects.project eq project and (Cards.cardInfoHash eq cardInfoHash)
                }
                .singleOrNull()
        return if (query == null) null else CardEntity.wrapRow(query)
    }

    fun insert(
        cardInfoHash: ByteArray,
        activationSecretHash: ByteArray?,
        expirationDay: Long?,
        regionId: Int,
        issuerId: Int,
        codeType: CodeType,
    ) =
        CardEntity.new {
            this.cardInfoHash = cardInfoHash
            this.activationSecretHash = activationSecretHash
            this.totpSecret = null
            this.expirationDay = expirationDay
            this.issueDate = Instant.now()
            this.regionId = EntityID(regionId, Regions)
            this.issuerId = EntityID(issuerId, Administrators)
            this.revoked = false
            this.codeType = codeType
        }

    fun activate(card: CardEntity, totpSecret: ByteArray) {
        if (card.codeType != CodeType.DYNAMIC) {
            throw Exception("Invalid Code Type.")
        }
        card.totpSecret = totpSecret
    }
}
