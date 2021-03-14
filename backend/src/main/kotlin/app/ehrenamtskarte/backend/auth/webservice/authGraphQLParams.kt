package app.ehrenamtskarte.backend.auth.webservice

import app.ehrenamtskarte.backend.auth.webservice.dataloader.ADMINISTRATOR_LOADER_NAME
import app.ehrenamtskarte.backend.auth.webservice.dataloader.administratorLoader
import app.ehrenamtskarte.backend.auth.webservice.schema.SignInMutationService
import app.ehrenamtskarte.backend.common.webservice.GraphQLParams
import com.expediagroup.graphql.SchemaGeneratorConfig
import com.expediagroup.graphql.TopLevelObject
import org.dataloader.DataLoaderRegistry


private fun createDataLoaderRegistry(): DataLoaderRegistry {
    val dataLoader = DataLoaderRegistry()
    dataLoader.register(ADMINISTRATOR_LOADER_NAME, administratorLoader)
    return dataLoader
}

val authGraphQlParams = GraphQLParams(
    config = SchemaGeneratorConfig(supportedPackages = listOf("app.ehrenamtskarte.backend.auth.webservice.schema")),
    dataLoaderRegistry = createDataLoaderRegistry(),
    mutations = listOf(
        TopLevelObject(SignInMutationService())
    ),
    queries = listOf()
)
