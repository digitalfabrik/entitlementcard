package app.ehrenamtskarte.backend.graphql.shared

import graphql.schema.DataFetchingEnvironment
import kotlinx.coroutines.runBlocking
import org.dataloader.DataLoader
import org.dataloader.DataLoaderFactory
import org.dataloader.DataLoaderOptions
import org.dataloader.DataLoaderRegistry
import java.util.concurrent.CompletableFuture

interface NamedDataLoader<K, V> {
    val name: String
    val loader: DataLoader<K, V>
}

fun <K, V> NamedDataLoader<K, V>.fromEnvironment(environment: DataFetchingEnvironment): DataLoader<K, V> =
    environment.getDataLoader(name)
        ?: throw IllegalArgumentException("Registry does not have a DataLoader named $name")

fun <K, V> newNamedDataLoader(name: String, loadBatch: suspend (ids: List<K>) -> List<V>): NamedDataLoader<K, V> =
    object : NamedDataLoader<K, V> {
        override val name = name
        override val loader = DataLoaderFactory.newDataLoader(
            { ids ->
                CompletableFuture.supplyAsync {
                    runBlocking { loadBatch(ids) }
                }
            },
            DataLoaderOptions.newOptions().setCachingEnabled(false),
        )
    }

fun createRegistryFromNamedDataLoaders(vararg loaders: NamedDataLoader<*, *>): DataLoaderRegistry {
    val registry = DataLoaderRegistry()
    loaders.forEach {
        if (it.name in registry.keys) {
            throw IllegalArgumentException("Duplicate name of data loader specified.")
        }
        registry.register(it.name, it.loader)
    }
    return registry
}
