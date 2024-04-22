package app.ehrenamtskarte.backend.verification.database.repos

import app.ehrenamtskarte.backend.auth.database.Administrators
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidCodeTypeException
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.regions.database.Regions
import app.ehrenamtskarte.backend.verification.database.CardEntity
import app.ehrenamtskarte.backend.verification.database.Cards
import app.ehrenamtskarte.backend.verification.database.CodeType
import app.ehrenamtskarte.backend.verification.webservice.schema.types.CardStatisticsResultModel
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.Coalesce
import org.jetbrains.exposed.sql.JoinType
import org.jetbrains.exposed.sql.SortOrder
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.inList
import org.jetbrains.exposed.sql.SqlExpressionBuilder.isNull
import org.jetbrains.exposed.sql.alias
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.count
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.intLiteral
import org.jetbrains.exposed.sql.select
import java.sql.Timestamp
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

    fun getCardStatisticsForProject(project: String, dateStart: Timestamp, dateEnd: Timestamp): List<CardStatisticsResultModel> {
        val numAlias = Coalesce(Cards.id.count(), intLiteral(0)).alias("numCards")
        val allCards = (Regions leftJoin Cards leftJoin Projects)
            .slice(Regions.id, numAlias)
            .select { Cards.issueDate.greaterEq(dateStart) and Cards.issueDate.lessEq(dateEnd) }
            .groupBy(Regions.id)
            .alias("AllCards")
        val activeCards = (Regions leftJoin Cards)
            .slice(Regions.id, numAlias)
            .select { Cards.firstActivationDate.isNotNull() and Cards.issueDate.greaterEq(dateStart) and Cards.issueDate.lessEq(dateEnd) }
            .groupBy(Regions.id)
            .alias("ActiveCards")
        val result =
            Regions
                .join(allCards, JoinType.LEFT, Regions.id, allCards[Regions.id])
                .join(activeCards, JoinType.LEFT, Regions.id, activeCards[Regions.id])
                .join(Projects, JoinType.LEFT, Projects.id, Regions.projectId)
                .slice(Regions.name, Regions.prefix, allCards[numAlias], activeCards[numAlias])
                .select(Projects.project eq project)
                .orderBy(Regions.name, SortOrder.DESC)
                .orderBy(Regions.prefix, SortOrder.DESC)
                .map { CardStatisticsResultModel(region = it[Regions.prefix] + ' ' + it[Regions.name], cardsCreated = (it[allCards[numAlias]] ?: 0).toInt(), cardsActivated = (it[activeCards[numAlias]] ?: 0).toInt()) }
                .toList()
        return result
    }
}
