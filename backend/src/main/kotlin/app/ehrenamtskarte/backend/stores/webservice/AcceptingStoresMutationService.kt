package app.ehrenamtskarte.backend.stores.webservice

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.ProjectNotFoundException
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.stores.database.repos.AcceptingStoresRepository
import app.ehrenamtskarte.backend.stores.webservice.schema.types.CSVAcceptingStore
import app.ehrenamtskarte.backend.stores.webservice.schema.types.StoreImportReturnResultModel
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class AcceptingStoresMutationService {
    @GraphQLDescription("Import accepting stores via csv")
    fun importAcceptingStores(stores: List<CSVAcceptingStore>, project: String, dryRun: Boolean, dfe: DataFetchingEnvironment): StoreImportReturnResultModel {
        val context = dfe.getContext<GraphQLContext>()
        val jwtPayload = context.enforceSignedIn()
        return transaction {
            val projectEntity =
                ProjectEntity.find { Projects.project eq project }.firstOrNull() ?: throw ProjectNotFoundException(
                    project
                )
            val user = AdministratorEntity.findById(jwtPayload.adminId)
                ?: throw UnauthorizedException()

            if (!Authorizer.mayUpdateStoresInProject(user, projectEntity.id.value)) {
                throw ForbiddenException()
            }

            val (storesCreated, storesToDelete, storesUntouched) = AcceptingStoresRepository.importAcceptingStores(stores, projectEntity, dryRun)

            return@transaction StoreImportReturnResultModel(storesCreated, storesToDelete, storesUntouched)
        }
    }
}
