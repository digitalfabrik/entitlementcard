package app.ehrenamtskarte.backend.cards.webservice

import app.ehrenamtskarte.backend.cards.webservice.schema.CardMutationService
import app.ehrenamtskarte.backend.cards.webservice.schema.CardQueryService
import app.ehrenamtskarte.backend.cards.webservice.schema.CardStatisticsQueryService
import app.ehrenamtskarte.backend.common.webservice.GraphQLParams
import app.ehrenamtskarte.backend.common.webservice.createRegistryFromNamedDataLoaders
import com.expediagroup.graphql.generator.SchemaGeneratorConfig
import com.expediagroup.graphql.generator.TopLevelObject

val cardsGraphQlParams = GraphQLParams(
    config = SchemaGeneratorConfig(
        supportedPackages = listOf("app.ehrenamtskarte.backend.cards.webservice.schema"),
    ),
    dataLoaderRegistry = createRegistryFromNamedDataLoaders(),
    queries = listOf(
        TopLevelObject(CardQueryService()),
        TopLevelObject(CardStatisticsQueryService()),
    ),
    mutations = listOf(
        TopLevelObject(CardMutationService()),
    ),
)
