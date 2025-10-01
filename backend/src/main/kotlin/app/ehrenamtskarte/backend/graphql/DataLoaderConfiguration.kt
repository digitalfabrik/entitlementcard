package app.ehrenamtskarte.backend.graphql

import kotlinx.coroutines.reactor.mono
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.context.annotation.Configuration
import org.springframework.graphql.execution.BatchLoaderRegistry
import reactor.core.scheduler.Schedulers
import kotlin.reflect.KClass

@Configuration
class DataLoaderConfiguration(
    private val registry: BatchLoaderRegistry,
    loaders: List<BaseDataLoader<*, *>>,
) {
    init {
        loaders.forEach { it.register(registry) }
    }
}

/**
 * Abstract base class for GraphQL data loaders.
 *
 * This class handles the common boilerplate for registering data loaders with Spring GraphQL.
 * Subclasses only need to implement the [loadBatch] function, which defines
 * how to fetch a batch of values for a given list of keys.
 *
 * @param K the type of the keys used for the batch loader (e.g., `Int`, `String`).
 * @param V the type of the values returned for each key (e.g., `Region`, `Administrator`).
 */
abstract class BaseDataLoader<K : Any, V : Any>(
    private val keyKClass: KClass<K>,
    private val valueKClass: KClass<V>,
) {
    fun register(registry: BatchLoaderRegistry) {
        registry.forTypePair(keyKClass.java, valueKClass.java)
            .registerMappedBatchLoader { keys, _ ->
                mono {
                    transaction {
                        loadBatch(keys.toList())
                    }
                }.subscribeOn(Schedulers.boundedElastic())
            }
    }

    abstract fun loadBatch(keys: List<K>): Map<K, V>
}
