package app.ehrenamtskarte.backend.graphql

import graphql.schema.DataFetchingEnvironment
import kotlinx.coroutines.reactor.mono
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.context.event.ContextRefreshedEvent
import org.springframework.context.event.EventListener
import org.springframework.graphql.execution.BatchLoaderRegistry
import org.springframework.stereotype.Component
import reactor.core.scheduler.Schedulers
import java.util.concurrent.CompletableFuture
import kotlin.reflect.KClass

@Component
class DataLoaderInitializer(
    private val registry: BatchLoaderRegistry,
    private val loaders: List<BaseDataLoader<*, *>>,
) {
    @EventListener
    fun onContextRefreshed(event: ContextRefreshedEvent) {
        loaders.forEach { it.register(registry) }
    }
}

/**
 * Helper to load a value from a DataLoader, reducing boilerplate in resolvers.
 * It throws an IllegalStateException if the DataLoader is not registered.
 */
fun <K : Any, V : Any> DataFetchingEnvironment.loadFrom(
    loaderClass: KClass<out BaseDataLoader<K, V>>,
    key: K,
): CompletableFuture<V?> =
    getDataLoader<K, V>(loaderClass.java.name)
        ?.load(key)
        ?: throw IllegalStateException("DataLoader '${loaderClass.simpleName}' not registered.")

/**
 * Abstract base class for GraphQL data loaders.
 *
 * This class handles the common boilerplate for registering data loaders with Spring GraphQL.
 * It uses a name-based registration strategy, where the name is derived from the loader's
 * class name. This allows it to support loaders that return generic types (e.g., List<V>).
 *
 * Subclasses only need to implement the [loadBatch] function, which defines
 * how to fetch a batch of values for a given list of keys.
 *
 * @param K the type of the keys used for the batch loader (e.g., `Int`, `String`).
 * @param V the type of the values returned for each key (e.g., `Region`, `List<Verification>`).
 */
abstract class BaseDataLoader<K : Any, V : Any> {
    open val dataLoaderName: String get() = this::class.java.name

    fun register(registry: BatchLoaderRegistry) {
        registry.forName<K, V>(dataLoaderName)
            .registerMappedBatchLoader { keys, _ ->
                mono {
                    transaction {
                        loadBatch(keys.toList())
                    }
                }.subscribeOn(Schedulers.boundedElastic())
            }
    }

    /**
     * Loads a batch of values for the given list of keys
     */
    abstract fun loadBatch(keys: List<K>): Map<K, V>
}
