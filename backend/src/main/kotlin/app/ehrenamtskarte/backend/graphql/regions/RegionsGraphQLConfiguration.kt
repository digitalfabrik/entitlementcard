package app.ehrenamtskarte.backend.graphql.regions

import app.ehrenamtskarte.backend.graphql.GraphQLParams
import com.expediagroup.graphql.generator.SchemaGeneratorConfig
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class RegionsGraphQLConfiguration {
    @Bean
    fun regionsGraphQlParams(): GraphQLParams =
        GraphQLParams(
            config = SchemaGeneratorConfig(
                supportedPackages = listOf("app.ehrenamtskarte.backend.graphql.regions.types"),
            ),
            queries = listOf(
                // TopLevelObject(RegionsQueryService()),
            ),
            mutations = listOf(
                // TopLevelObject(RegionsMutationService()),
            ),
        )
}
