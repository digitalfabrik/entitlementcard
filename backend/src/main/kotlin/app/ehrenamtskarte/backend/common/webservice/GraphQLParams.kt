package app.ehrenamtskarte.backend.common.webservice

import com.expediagroup.graphql.SchemaGeneratorConfig
import com.expediagroup.graphql.TopLevelObject
import org.dataloader.DataLoaderRegistry

data class GraphQLParams(
    val config: SchemaGeneratorConfig,
    val dataLoaderRegistry: DataLoaderRegistry,
    val queries: List<TopLevelObject>,
    val mutations: List<TopLevelObject> = emptyList(),
    val subscriptions: List<TopLevelObject> = emptyList()
) {
    infix fun stitch(other: GraphQLParams): GraphQLParams {
        return GraphQLParams(
            config + other.config,
            dataLoaderRegistry.combine(other.dataLoaderRegistry),
            queries + other.queries,
            mutations + other.mutations,
            subscriptions + other.subscriptions
        )
    }
}

// Stitch together schemeGeneratorConfigs. Everything except supportedPackages is ignored.
infix operator fun SchemaGeneratorConfig.plus (other: SchemaGeneratorConfig): SchemaGeneratorConfig {
    return SchemaGeneratorConfig(this.supportedPackages + other.supportedPackages
    )
}
