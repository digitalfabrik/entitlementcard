package app.ehrenamtskarte.backend.graphql

import app.ehrenamtskarte.backend.graphql.cards.CardQueryService
import com.expediagroup.graphql.generator.SchemaGeneratorConfig
import com.expediagroup.graphql.generator.TopLevelObject
import com.expediagroup.graphql.generator.toSchema
import graphql.schema.GraphQLSchema
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class GraphQLConfiguration {
    @Bean
    fun graphQLSchema(
        cardQueryService: CardQueryService
    ): GraphQLSchema {
        val config = SchemaGeneratorConfig(
            supportedPackages = listOf(
                "app.ehrenamtskarte.backend.graphql.cards.types",
                "app.ehrenamtskarte.backend.graphql.shared.types"
            )
        )
        val queries = listOf(
            TopLevelObject(cardQueryService)
        )
        return toSchema(
            config = config,
            queries = queries,
        )
    }
}
