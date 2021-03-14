package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.application.webservice.schema.create.UploadKey
import app.ehrenamtskarte.backend.common.webservice.GraphQLParams
import com.expediagroup.graphql.SchemaGeneratorConfig
import com.expediagroup.graphql.TopLevelObject
import com.expediagroup.graphql.hooks.SchemaGeneratorHooks
import graphql.kickstart.servlet.apollo.ApolloScalars
import org.dataloader.DataLoaderRegistry
import kotlin.reflect.KType
import graphql.schema.*


private fun createDataLoaderRegistry(): DataLoaderRegistry {
    val dataLoaderRegistry = DataLoaderRegistry()
    return dataLoaderRegistry
}

val applicationGraphQlParams = GraphQLParams(
    config = SchemaGeneratorConfig(
        supportedPackages = listOf("app.ehrenamtskarte.backend.application.webservice.schema"),
        hooks = object : SchemaGeneratorHooks {
            override fun willGenerateGraphQLType(type: KType): GraphQLType? =
                if (type.classifier == UploadKey::class) ApolloScalars.Upload else null
        }
    ),
    dataLoaderRegistry = createDataLoaderRegistry(),
    queries = listOf(),
    mutations = listOf(
        TopLevelObject(EakApplicationMutationService())
    )
)
