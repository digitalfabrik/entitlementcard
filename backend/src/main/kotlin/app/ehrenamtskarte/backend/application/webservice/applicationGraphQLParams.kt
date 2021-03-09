package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.common.webservice.GraphQLParams
import com.expediagroup.graphql.SchemaGeneratorConfig
import com.expediagroup.graphql.TopLevelObject
import org.dataloader.DataLoaderRegistry


private fun createDataLoaderRegistry(): DataLoaderRegistry {
    val dataLoaderRegistry = DataLoaderRegistry();
    return dataLoaderRegistry
}

val applicationGraphQlParams = GraphQLParams(
    config = SchemaGeneratorConfig(supportedPackages = listOf("app.ehrenamtskarte.backend.application.webservice.schema")),
    dataLoaderRegistry = createDataLoaderRegistry(),
    queries = listOf(),
    mutations = listOf(
        TopLevelObject(EakApplicationMutationService())
    )
)
