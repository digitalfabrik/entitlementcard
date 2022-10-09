package app.ehrenamtskarte.backend.auth.webservice.dataloader

import app.ehrenamtskarte.backend.auth.webservice.schema.types.Role
import app.ehrenamtskarte.backend.auth.database.repos.AdministratorsRepository
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Administrator
import com.expediagroup.graphql.exceptions.GraphQLKotlinException
import kotlinx.coroutines.runBlocking
import org.dataloader.DataLoader
import org.dataloader.DataLoaderFactory
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.concurrent.CompletableFuture

const val ADMINISTRATOR_LOADER_NAME = "ADMINISTRATOR_LOADER"

val administratorLoader: DataLoader<Int, Administrator?> = DataLoaderFactory.newDataLoader { ids ->
    CompletableFuture.supplyAsync {
        runBlocking {
            transaction {
                AdministratorsRepository.findByIds(ids).map {
                    if (it == null) null
                    else {
                        val role = Role.fromDbValue(it.role) ?: throw GraphQLKotlinException("Invalid role.")
                        Administrator(it.id.value, it.email, it.regionId?.value, role)
                    }
                }
            }
        }
    }
}
