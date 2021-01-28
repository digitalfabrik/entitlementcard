package app.ehrenamtskarte.backend.verification.webservice

import app.ehrenamtskarte.backend.common.webservice.GraphQLHandler
import app.ehrenamtskarte.backend.verification.webservice.schema.CardQueryService
import com.expediagroup.graphql.SchemaGeneratorConfig
import com.expediagroup.graphql.TopLevelObject
import com.expediagroup.graphql.toSchema
import graphql.GraphQL


class VerificationGraphQLHandler : GraphQLHandler(graphQL) {
    companion object {
        private val config = SchemaGeneratorConfig(supportedPackages = listOf("app.ehrenamtskarte.backend.verification.webservice.schema"))
        private val queries = listOf(
            TopLevelObject(CardQueryService())
        )
        private val mutations = listOf<TopLevelObject>(
            // TODO add addCard mutation
        )
        val graphQLSchema = toSchema(config, queries, mutations)
        val graphQL = GraphQL.newGraphQL(graphQLSchema).build()!!
    }
}
