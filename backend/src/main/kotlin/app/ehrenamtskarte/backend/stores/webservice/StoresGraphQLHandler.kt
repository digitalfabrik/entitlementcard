package app.ehrenamtskarte.backend.stores.webservice

import app.ehrenamtskarte.backend.common.webservice.GraphQLHandler
import app.ehrenamtskarte.backend.stores.webservice.schema.AcceptingStoreQueryService
import app.ehrenamtskarte.backend.stores.webservice.schema.CategoriesQueryService
import com.expediagroup.graphql.SchemaGeneratorConfig
import com.expediagroup.graphql.TopLevelObject
import com.expediagroup.graphql.toSchema
import graphql.GraphQL

class StoresGraphQLHandler : GraphQLHandler(
    graphQL,
    ::initializeDataLoaderRegistry
) {
    companion object {
        private val config = SchemaGeneratorConfig(supportedPackages = listOf("app.ehrenamtskarte.backend.stores.webservice.schema"))
        private val queries = listOf(
            TopLevelObject(AcceptingStoreQueryService()),
            TopLevelObject(CategoriesQueryService())
        )
        val graphQLSchema = toSchema(config, queries)
        val graphQL = GraphQL.newGraphQL(graphQLSchema).build()!!
    }
}
