package app.ehrenamtskarte.backend.graphql.application.dataloader

import app.ehrenamtskarte.backend.graphql.newNamedDataLoader
import app.ehrenamtskarte.backend.db.entities.ApplicationVerificationEntity
import app.ehrenamtskarte.backend.db.entities.ApplicationVerifications
import app.ehrenamtskarte.backend.db.entities.Applications
import app.ehrenamtskarte.backend.db.repositories.ApplicationRepository
import app.ehrenamtskarte.backend.graphql.application.schema.view.ApplicationAdminGql
import app.ehrenamtskarte.backend.graphql.application.schema.view.ApplicationVerificationView
import org.jetbrains.exposed.sql.SortOrder
import org.jetbrains.exposed.sql.transactions.transaction

val applicationLoader = newNamedDataLoader("APPLICATION_LOADER") { ids ->
    transaction {
        ApplicationRepository.findByIds(ids).map {
            it?.let { ApplicationAdminGql.fromDbEntity(it) }
        }
    }
}

val verificationsByApplicationLoader = newNamedDataLoader<Int, _>(
    "VERIFICATIONS_BY_APPLICATION_LOADER",
) { ids ->
    transaction {
        val list = (Applications leftJoin ApplicationVerifications)
            .select(ApplicationVerifications.columns + Applications.id)
            .where { Applications.id inList ids }
            .orderBy(Applications.id to SortOrder.ASC, ApplicationVerifications.id to SortOrder.ASC)
            .toList()
        val groupedByApplication = list.groupBy { row -> row[Applications.id].value }
        val entities = ids.map { id ->
            groupedByApplication[id]?.let { list ->
                val verificationEntities = list.mapNotNull {
                    if (it.getOrNull(ApplicationVerifications.id) == null) {
                        null
                    } else {
                        ApplicationVerificationEntity.wrapRow(it)
                    }
                }
                verificationEntities
            }
        }
        entities.map {
            it?.let { verificationEntities ->
                verificationEntities.map { entity ->
                    ApplicationVerificationView.fromDbEntity(entity)
                }
            }
        }
    }
}
