package app.ehrenamtskarte.backend.stores.webservice

import app.ehrenamtskarte.backend.exception.service.ProjectNotFoundException
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.stores.database.repos.AcceptingStoresRepository
import app.ehrenamtskarte.backend.stores.utils.mapCsvToStore
import app.ehrenamtskarte.backend.stores.webservice.schema.types.CSVAcceptingStore
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class AcceptingStoresMutationService {
    @GraphQLDescription("Import accepting stores via csv")
    fun importAcceptingStores(stores: List<CSVAcceptingStore>, project: String): Boolean {
        transaction {
            val projectEntity =
                ProjectEntity.find { Projects.project eq project }.firstOrNull() ?: throw ProjectNotFoundException(
                    project
                )
            AcceptingStoresRepository.createStores(stores.map { store -> mapCsvToStore(store) }, projectEntity.id)
        }
        return true
    }
}
