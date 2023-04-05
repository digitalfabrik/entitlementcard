package app.ehrenamtskarte.backend.verification.webservice

import app.ehrenamtskarte.backend.common.webservice.GraphQLParams
import app.ehrenamtskarte.backend.common.webservice.createRegistryFromNamedDataLoaders
import app.ehrenamtskarte.backend.verification.webservice.schema.CardMutationService
import app.ehrenamtskarte.backend.verification.webservice.schema.CardQueryService
import com.expediagroup.graphql.generator.SchemaGeneratorConfig
import com.expediagroup.graphql.generator.TopLevelObject

val verificationGraphQlParams = GraphQLParams(
    config = SchemaGeneratorConfig(supportedPackages = listOf("app.ehrenamtskarte.backend.verification.webservice.schema")),
    dataLoaderRegistry = createRegistryFromNamedDataLoaders(),
    queries = listOf(
        TopLevelObject(CardQueryService())
    ),
    mutations = listOf(
        TopLevelObject(CardMutationService())
    )
)
