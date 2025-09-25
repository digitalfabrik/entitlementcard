package app.ehrenamtskarte.backend.graphql.cards

import app.ehrenamtskarte.backend.graphql.GraphQLParams
import com.expediagroup.graphql.generator.SchemaGeneratorConfig
import com.expediagroup.graphql.generator.TopLevelObject
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class CardsGraphQLConfiguration {
    @Bean
    fun cardsGraphQlParams(cardQueryController: CardQueryController): GraphQLParams =
        GraphQLParams(
            config = SchemaGeneratorConfig(
                supportedPackages = listOf("app.ehrenamtskarte.backend.graphql.cards.types"),
            ),
            queries = listOf(
                TopLevelObject(cardQueryController),
                // TopLevelObject(CardStatisticsQueryService()),
            ),
            mutations = listOf(
                // TopLevelObject(cardMutationService),
            ),
        )
}
