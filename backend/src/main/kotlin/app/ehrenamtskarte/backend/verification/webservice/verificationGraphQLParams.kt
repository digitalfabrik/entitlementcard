package app.ehrenamtskarte.backend.verification.webservice

import app.ehrenamtskarte.backend.common.webservice.GraphQLParams
import app.ehrenamtskarte.backend.verification.webservice.schema.CardMutationService
import app.ehrenamtskarte.backend.verification.webservice.schema.CardQueryService
import com.expediagroup.graphql.generator.SchemaGeneratorConfig
import com.expediagroup.graphql.generator.TopLevelObject
import org.dataloader.DataLoaderRegistry

private fun createDataLoaderRegistry(): DataLoaderRegistry {
    val dataLoaderRegistry = DataLoaderRegistry()
    // Maybe integrate a dataloader for cards here.
    return dataLoaderRegistry
}

val verificationGraphQlParams = GraphQLParams(
    config = SchemaGeneratorConfig(supportedPackages = listOf("app.ehrenamtskarte.backend.verification.webservice.schema")),
    dataLoaderRegistry = createDataLoaderRegistry(),
    queries = listOf(
        TopLevelObject(CardQueryService())
    ),
    mutations = listOf(
        TopLevelObject(CardMutationService())
    )
)
