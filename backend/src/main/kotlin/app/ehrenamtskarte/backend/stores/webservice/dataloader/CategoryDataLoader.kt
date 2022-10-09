package app.ehrenamtskarte.backend.stores.webservice.dataloader

import app.ehrenamtskarte.backend.stores.database.repos.CategoriesRepository
import app.ehrenamtskarte.backend.stores.webservice.schema.types.Category
import kotlinx.coroutines.runBlocking
import org.dataloader.DataLoader
import org.dataloader.DataLoaderFactory
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.concurrent.CompletableFuture

const val CATEGORY_LOADER_NAME = "CATEGORY_LOADER"

val categoryLoader: DataLoader<Int, Category?> = DataLoaderFactory.newDataLoader { ids ->
    CompletableFuture.supplyAsync {
        runBlocking {
            transaction {
                CategoriesRepository.findByIds(ids).map {
                    if (it == null) null
                    else Category(it.id.value, it.name)
                }
            }
        }
    }
}
