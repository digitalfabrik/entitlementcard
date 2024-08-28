package app.ehrenamtskarte.backend.stores.webservice

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.ProjectNotFoundException
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.DatabaseIOException
import app.ehrenamtskarte.backend.mail.Mailer
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.stores.database.AcceptingStores
import app.ehrenamtskarte.backend.stores.database.repos.AcceptingStoresRepository
import app.ehrenamtskarte.backend.stores.utils.mapCsvToStore
import app.ehrenamtskarte.backend.stores.webservice.schema.types.CSVAcceptingStore
import app.ehrenamtskarte.backend.stores.webservice.schema.types.StoreImportResultModel
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.LoggerFactory

@Suppress("unused")
class AcceptingStoresMutationService {
    @GraphQLDescription("Import accepting stores via csv")
    fun importAcceptingStores(stores: List<CSVAcceptingStore>, project: String, dryRun: Boolean, dfe: DataFetchingEnvironment): StoreImportResultModel {
        val logger = LoggerFactory.getLogger(Mailer::class.java)
        val context = dfe.getContext<GraphQLContext>()
        val jwtPayload = context.enforceSignedIn()
        return transaction t@{
            val projectEntity =
                ProjectEntity.find { Projects.project eq project }.firstOrNull() ?: throw ProjectNotFoundException(
                    project
                )
            val user = AdministratorEntity.findById(jwtPayload.adminId)
                ?: throw UnauthorizedException()

            if (!Authorizer.mayUpdateStoresInProject(user, projectEntity.id.value)) {
                throw ForbiddenException()
            }

            try {
                var numStoresCreated = 0
                var numStoresUntouched = 0
                val acceptingStoreIdsToRemove =
                    AcceptingStores.slice(AcceptingStores.id).select { AcceptingStores.projectId eq projectEntity.id }
                        .map { it[AcceptingStores.id].value }.toMutableSet()

                for (acceptingStore in stores) {
                    // If an exact duplicate is found in the DB, we do not recreate it and instead
                    // remove the id from `acceptingStoreIdsToRemove`.
                    val existingStoreId: Int? =
                        AcceptingStoresRepository.determineRemovableAcceptingStoreId(mapCsvToStore(acceptingStore), projectEntity)
                    if (existingStoreId != null) {
                        acceptingStoreIdsToRemove.remove(existingStoreId)
                        numStoresUntouched += 1
                        continue
                    }
                    if (!dryRun) {
                        AcceptingStoresRepository.createStore(mapCsvToStore(acceptingStore), projectEntity)
                    }
                    numStoresCreated += 1
                }
                if (!dryRun) {
                    AcceptingStoresRepository.deleteStores(acceptingStoreIdsToRemove)
                }
                return@t StoreImportResultModel(numStoresCreated, acceptingStoreIdsToRemove.size, numStoresUntouched)
            } catch (e: DatabaseIOException) {
                logger.error(e.message)
                rollback()
                throw DatabaseIOException()
            }
        }
    }
}
