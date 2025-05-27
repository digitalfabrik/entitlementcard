package app.ehrenamtskarte.backend.application.webservice.dataloader

import app.ehrenamtskarte.backend.application.database.ApplicationVerificationEntity
import app.ehrenamtskarte.backend.application.database.ApplicationVerifications
import app.ehrenamtskarte.backend.application.database.Applications
import app.ehrenamtskarte.backend.application.database.repos.ApplicationRepository
import app.ehrenamtskarte.backend.application.webservice.schema.view.ApplicationVerificationView
import app.ehrenamtskarte.backend.application.webservice.schema.view.ApplicationView
import app.ehrenamtskarte.backend.common.webservice.newNamedDataLoader
import org.jetbrains.exposed.sql.SortOrder
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction

val applicationLoader = newNamedDataLoader("APPLICATION_LOADER") { ids ->
    transaction {
        ApplicationRepository.findByIds(ids).map {
            it?.let { ApplicationView.fromDbEntity(it) }
        }
    }
}

val verificationsByApplicationLoader = newNamedDataLoader<Int, _>(
    "VERIFICATIONS_BY_APPLICATION_LOADER",
) { ids ->
    transaction {
        val list = (Applications leftJoin ApplicationVerifications)
            .slice(listOf(Applications.id).plus(ApplicationVerifications.columns))
            .select { Applications.id inList ids }
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
