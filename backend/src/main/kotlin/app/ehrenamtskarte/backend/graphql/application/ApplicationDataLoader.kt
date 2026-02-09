package app.ehrenamtskarte.backend.graphql.application

import app.ehrenamtskarte.backend.db.entities.ApplicationVerificationEntity
import app.ehrenamtskarte.backend.db.entities.ApplicationVerifications
import app.ehrenamtskarte.backend.db.entities.Applications
import app.ehrenamtskarte.backend.db.repositories.ApplicationRepository
import app.ehrenamtskarte.backend.graphql.BaseDataLoader
import app.ehrenamtskarte.backend.graphql.application.types.ApplicationAdminGql
import app.ehrenamtskarte.backend.graphql.application.types.ApplicationVerificationView
import org.jetbrains.exposed.v1.core.SortOrder
import org.jetbrains.exposed.v1.core.inList
import org.jetbrains.exposed.v1.jdbc.select
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.springframework.stereotype.Component

@Component
class ApplicationDataLoader : BaseDataLoader<Int, ApplicationAdminGql>() {
    override fun loadBatch(keys: List<Int>): Map<Int, ApplicationAdminGql> =
        transaction {
            ApplicationRepository.findByIds(keys)
                .mapNotNull { it?.let { entity -> entity.id.value to ApplicationAdminGql.fromDbEntity(entity) } }
                .toMap()
        }
}

@Component
class VerificationsByApplicationDataLoader : BaseDataLoader<Int, List<ApplicationVerificationView>>() {
    override fun loadBatch(keys: List<Int>): Map<Int, List<ApplicationVerificationView>> {
        val rowsByApplicationId = transaction {
            (Applications leftJoin ApplicationVerifications)
                .select(ApplicationVerifications.columns + Applications.id)
                .where { Applications.id inList keys }
                .orderBy(Applications.id to SortOrder.ASC, ApplicationVerifications.id to SortOrder.ASC)
                .toList()
                .groupBy { it[Applications.id].value }
        }
        return keys.associateWith { key ->
            rowsByApplicationId[key]?.mapNotNull { row ->
                row.getOrNull(ApplicationVerifications.id)?.let {
                    ApplicationVerificationView.fromDbEntity(ApplicationVerificationEntity.wrapRow(row))
                }
            } ?: emptyList()
        }
    }
}
