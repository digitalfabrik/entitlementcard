package app.ehrenamtskarte.backend.graphql

import app.ehrenamtskarte.backend.graphql.regions.RegionDataLoader
import graphql.GraphQLContext
import org.dataloader.DataLoaderFactory
import org.dataloader.DataLoaderRegistry
import org.springframework.graphql.execution.DataLoaderRegistrar
import org.springframework.stereotype.Component

@Component
class DataLoaderRegistryConfiguration(
    private val regionDataLoader: RegionDataLoader,
) : DataLoaderRegistrar {
    override fun registerDataLoaders(registry: DataLoaderRegistry, context: GraphQLContext) {
        registry.register(
            regionDataLoader.dataLoaderName,
            DataLoaderFactory.newDataLoader(regionDataLoader.batchLoader),
        )
    }
}
