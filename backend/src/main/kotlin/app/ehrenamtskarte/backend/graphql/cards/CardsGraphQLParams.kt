package app.ehrenamtskarte.backend.graphql.cards

import app.ehrenamtskarte.backend.graphql.cards.schema.CardMutationService
import app.ehrenamtskarte.backend.graphql.cards.schema.CardQueryService
import app.ehrenamtskarte.backend.graphql.cards.schema.CardStatisticsQueryService
import app.ehrenamtskarte.backend.graphql.shared.GraphQLParams
import app.ehrenamtskarte.backend.graphql.shared.createRegistryFromNamedDataLoaders
import com.expediagroup.graphql.generator.SchemaGeneratorConfig
import com.expediagroup.graphql.generator.TopLevelObject

val cardsGraphQlParams = GraphQLParams(
    config = SchemaGeneratorConfig(
        supportedPackages = listOf("app.ehrenamtskarte.backend.graphql.cards.schema"),
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
