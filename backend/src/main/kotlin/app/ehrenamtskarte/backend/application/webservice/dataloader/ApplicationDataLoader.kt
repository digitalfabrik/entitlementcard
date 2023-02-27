package app.ehrenamtskarte.backend.application.webservice.dataloader

import app.ehrenamtskarte.backend.application.database.ApplicationVerificationEntity
import app.ehrenamtskarte.backend.application.database.ApplicationVerifications
import app.ehrenamtskarte.backend.application.database.ApplicationVerifications.nullable
import app.ehrenamtskarte.backend.application.database.Applications
import app.ehrenamtskarte.backend.application.database.repos.ApplicationRepository
import app.ehrenamtskarte.backend.application.webservice.schema.view.ApplicationVerificationView
import app.ehrenamtskarte.backend.application.webservice.schema.view.ApplicationView
import kotlinx.coroutines.runBlocking
import org.dataloader.DataLoader
import org.dataloader.DataLoaderFactory
import org.jetbrains.exposed.sql.SortOrder
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.concurrent.CompletableFuture

const val APPLICATION_LOADER_NAME = "APPLICATION_LOADER"

val applicationLoader: DataLoader<Int, ApplicationView?> = DataLoaderFactory.newDataLoader { ids ->
    CompletableFuture.supplyAsync {
        runBlocking {
            transaction {
                ApplicationRepository.findByIds(ids).map { it?.let { ApplicationView.fromDbEntity(it) } }
            }
        }
    }
}

const val VERIFICATIONS_BY_APPLICATION_LOADER_NAME = "VERIFICATIONS_BY_APPLICATION_LOADER"
val verificationsByApplicationLoader: DataLoader<Int, List<ApplicationVerificationView>?> =
    DataLoaderFactory.newDataLoader { ids ->
        CompletableFuture.supplyAsync {
            runBlocking {
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
                                if (it[ApplicationVerifications.id.nullable()] == null) {
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
        }
    }
