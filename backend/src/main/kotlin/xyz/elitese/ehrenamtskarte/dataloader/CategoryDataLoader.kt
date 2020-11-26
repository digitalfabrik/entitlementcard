package xyz.elitese.ehrenamtskarte.dataloader

import kotlinx.coroutines.runBlocking
import org.dataloader.DataLoader
import xyz.elitese.ehrenamtskarte.schema.types.Category
import java.util.concurrent.CompletableFuture

const val CATEGORY_LOADER_NAME = "CATEGORY_LOADER"

val allCategories = listOf(
        Category(1, "Kleidungsgeschäft", "https://google.com/jpg.jpg"),
        Category(2, "Groceries", "https://google.com/jpg.jpg"),
        Category(3, "Gelato", "https://google.com/jpg.jpg")
)


val batchCategoryLoader = DataLoader<Long, Category?> { ids ->
    CompletableFuture.supplyAsync {
        runBlocking { // Mock Contact
            ids.map { id -> allCategories.find { category -> category.id == id }}
        }
    }
}
