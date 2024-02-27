package app.ehrenamtskarte.backend.verification.database.repos

import app.ehrenamtskarte.backend.auth.database.Administrators
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidCodeTypeException
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.regions.database.Regions
import app.ehrenamtskarte.backend.verification.database.CardEntity
import app.ehrenamtskarte.backend.verification.database.Cards
import app.ehrenamtskarte.backend.verification.database.CodeType
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.inList
import org.jetbrains.exposed.sql.SqlExpressionBuilder.isNull
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.select
import java.time.Instant

object CardRepository {
    fun deleteInactiveCardsByHash(regionId: Int, cardInfoHashList: List<ByteArray>) {
        Cards.deleteWhere {
            firstActivationDate.isNull() and (cardInfoHash inList cardInfoHashList) and (Cards.regionId eq regionId)
        }
    }

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
        startDay: Long?
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
            this.startDay = startDay
        }

    fun activate(card: CardEntity, totpSecret: ByteArray) {
        if (card.codeType != CodeType.DYNAMIC) {
            throw InvalidCodeTypeException()
        }
        card.totpSecret = totpSecret
        if (card.firstActivationDate == null) {
            card.firstActivationDate = Instant.now()
        }
    }
}
