package app.ehrenamtskarte.backend.cards.database.repos

import app.ehrenamtskarte.backend.auth.database.Administrators
import app.ehrenamtskarte.backend.cards.database.CardEntity
import app.ehrenamtskarte.backend.cards.database.Cards
import app.ehrenamtskarte.backend.cards.database.CodeType
import app.ehrenamtskarte.backend.cards.webservice.schema.types.CardStatisticsResultModel
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidCodeTypeException
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.regions.database.Regions
import app.ehrenamtskarte.backend.userdata.database.UserEntitlements
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.Coalesce
import org.jetbrains.exposed.sql.JoinType
import org.jetbrains.exposed.sql.SortOrder
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.greaterEq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.inList
import org.jetbrains.exposed.sql.SqlExpressionBuilder.isNotNull
import org.jetbrains.exposed.sql.SqlExpressionBuilder.isNull
import org.jetbrains.exposed.sql.SqlExpressionBuilder.less
import org.jetbrains.exposed.sql.alias
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.count
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.intLiteral
import org.jetbrains.exposed.sql.update
import java.time.Instant

object CardRepository {
    fun deleteInactiveCardsByHash(regionId: Int, cardInfoHashList: List<ByteArray>) {
        Cards.deleteWhere {
            firstActivationDate.isNull() and (cardInfoHash inList cardInfoHashList) and (Cards.regionId eq regionId)
        }
    }

    fun findByHash(project: String, cardInfoHash: ByteArray): CardEntity? {
        val query = (Projects innerJoin Regions innerJoin Cards)
            .select(Cards.columns)
            .where(Projects.project eq project and (Cards.cardInfoHash eq cardInfoHash))
            .singleOrNull()
        return if (query == null) null else CardEntity.wrapRow(query)
    }

    fun insert(
        cardInfoHash: ByteArray,
        activationSecretHash: ByteArray?,
        expirationDay: Long?,
        regionId: Int,
        issuerId: Int?,
        entitlementId: Int?,
        codeType: CodeType,
        startDay: Long?,
    ) = CardEntity.new {
        this.cardInfoHash = cardInfoHash
        this.activationSecretHash = activationSecretHash
        this.totpSecret = null
        this.expirationDay = expirationDay
        this.issueDate = Instant.now()
        this.regionId = EntityID(regionId, Regions)
        this.issuerId = if (issuerId != null) EntityID(issuerId, Administrators) else null
        this.entitlementId = if (entitlementId != null) EntityID(entitlementId, UserEntitlements) else null
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

    fun getCardStatisticsByProjectAndRegion(
        projectId: Int,
        from: Instant,
        until: Instant,
        regionId: Int?,
    ): List<CardStatisticsResultModel> {
        val numAlias = Coalesce(Cards.id.count(), intLiteral(0)).alias("numCards")
        val cardsCreated = (Regions leftJoin Cards leftJoin Projects)
            .select(Regions.id, numAlias)
            .where(Cards.issueDate.greaterEq(from) and Cards.issueDate.less(until))
            .groupBy(Regions.id)
            .alias("AllCards")
        val activeCards = (Regions leftJoin Cards)
            .select(Regions.id, numAlias)
            .where(
                Cards.firstActivationDate.isNotNull() and
                    Cards.issueDate.greaterEq(from) and
                    Cards.issueDate.less(until),
            )
            .groupBy(Regions.id)
            .alias("ActiveCards")
        val query = Regions
            .join(cardsCreated, JoinType.LEFT, Regions.id, cardsCreated[Regions.id])
            .join(activeCards, JoinType.LEFT, Regions.id, activeCards[Regions.id])
            .select(Regions.name, Regions.prefix, cardsCreated[numAlias], activeCards[numAlias])
            .where(if (regionId == null) Regions.projectId eq projectId else Regions.id eq regionId)
            .orderBy(Regions.name, SortOrder.ASC)
            .orderBy(Regions.prefix, SortOrder.ASC)
        return query
            .map {
                CardStatisticsResultModel(
                    region = it[Regions.prefix] + ' ' + it[Regions.name],
                    cardsCreated = (it.getOrNull(cardsCreated[numAlias]) ?: 0).toInt(),
                    cardsActivated = (it.getOrNull(activeCards[numAlias]) ?: 0).toInt(),
                )
            }
            .toList()
    }

    fun revokeByEntitlementId(entitlementId: Int): Int =
        Cards.update({
            Cards.entitlementId eq entitlementId and (Cards.revoked eq false)
        }) {
            it[revoked] = true
        }
}
