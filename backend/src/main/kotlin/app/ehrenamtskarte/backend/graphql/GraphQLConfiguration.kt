package app.ehrenamtskarte.backend.graphql

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode
import com.expediagroup.graphql.generator.SchemaGeneratorConfig
import com.expediagroup.graphql.generator.toSchema
import graphql.schema.GraphQLEnumType
import graphql.schema.GraphQLEnumType.newEnum
import graphql.schema.GraphQLEnumValueDefinition
import graphql.schema.GraphQLEnumValueDefinition.newEnumValueDefinition
import graphql.schema.GraphQLSchema
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class GraphQLConfiguration(
    private val graphQlParams: List<GraphQLParams>,
) {
    private val baseConfig = SchemaGeneratorConfig(
        listOf("app.ehrenamtskarte.backend.graphql.shared.types"),
        additionalTypes = setOf<GraphQLEnumType>(
            newEnum()
                .name("GraphQLExceptionCode")
                .values(
                    GraphQLExceptionCode.entries.map<GraphQLExceptionCode, GraphQLEnumValueDefinition> {
                        newEnumValueDefinition()
                            .name(it.name)
                            .value(it.name)
                            .build()
                    },
                ).build(),
        ),
    )

    @Bean
    fun graphQLSchema(): GraphQLSchema {
        val config = graphQlParams.fold(baseConfig) { acc, params -> acc.plus(params.config) }
        return toSchema(
            config = config,
            queries = graphQlParams.flatMap { it.queries },
            mutations = graphQlParams.flatMap { it.mutations },
            subscriptions = graphQlParams.flatMap { it.subscriptions },
        )
    }
}
