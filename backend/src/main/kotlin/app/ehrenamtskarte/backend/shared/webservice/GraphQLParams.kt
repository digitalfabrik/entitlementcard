package app.ehrenamtskarte.backend.shared.webservice

import com.expediagroup.graphql.generator.SchemaGeneratorConfig
import com.expediagroup.graphql.generator.TopLevelObject
import com.expediagroup.graphql.generator.hooks.NoopSchemaGeneratorHooks
import org.dataloader.DataLoaderRegistry

data class GraphQLParams(
    val config: SchemaGeneratorConfig,
    val dataLoaderRegistry: DataLoaderRegistry,
    val queries: List<TopLevelObject>,
    val mutations: List<TopLevelObject> = emptyList(),
    val subscriptions: List<TopLevelObject> = emptyList(),
) {
    infix fun stitch(other: GraphQLParams): GraphQLParams {
        val duplicateDataLoaderNames = dataLoaderRegistry.keys.intersect(
            other.dataLoaderRegistry.keys,
        )
        if (duplicateDataLoaderNames.isNotEmpty()) {
            throw IllegalArgumentException(
                "Duplicate names for data loaders found: $duplicateDataLoaderNames",
            )
        }
        return GraphQLParams(
            config + other.config,
            dataLoaderRegistry.combine(other.dataLoaderRegistry),
            queries + other.queries,
            mutations + other.mutations,
            subscriptions + other.subscriptions,
        )
    }
}

// Stitch together schemeGeneratorConfigs. Everything except supportedPackages is ignored.
infix operator fun SchemaGeneratorConfig.plus(other: SchemaGeneratorConfig): SchemaGeneratorConfig {
    // This is quite hacky, but we can migrate to graphql-kotlin-federation once we need more than one custom hook
    // https://github.com/ExpediaGroup/graphql-kotlin/tree/master/generator/graphql-kotlin-federation
    val hooks = if (hooks == NoopSchemaGeneratorHooks) other.hooks else hooks
    return SchemaGeneratorConfig(
        this.supportedPackages + other.supportedPackages,
        hooks = hooks,
        additionalTypes = this.additionalTypes + other.additionalTypes,
    )
}
