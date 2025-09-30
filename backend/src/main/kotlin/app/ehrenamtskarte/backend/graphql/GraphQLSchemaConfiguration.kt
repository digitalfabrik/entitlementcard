package app.ehrenamtskarte.backend.graphql

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode
import com.expediagroup.graphql.generator.SchemaGeneratorConfig
import com.expediagroup.graphql.generator.TopLevelObject
import com.expediagroup.graphql.generator.toSchema
import graphql.schema.GraphQLEnumType
import graphql.schema.GraphQLEnumValueDefinition
import graphql.schema.GraphQLSchema
import org.springframework.context.ApplicationContext
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.graphql.data.method.annotation.MutationMapping
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.stereotype.Controller
import kotlin.reflect.full.memberFunctions

/**
 * Configuration class that builds the GraphQL schema for the application.
 *
 * This class automatically detects all Spring beans annotated with [Controller]
 * and registers their methods annotated with [QueryMapping] or [MutationMapping]
 * as GraphQL queries and mutations, respectively.
 */
@Configuration
class GraphQLSchemaConfiguration(
    private val applicationContext: ApplicationContext,
) {
    @Bean
    fun graphQLSchema(): GraphQLSchema {
        val controllers = applicationContext
            .getBeansWithAnnotation(Controller::class.java)
            .values

        val queries = controllers.filter { controller ->
            controller::class.memberFunctions.any { it.annotations.any { it is QueryMapping } }
        }.map { TopLevelObject(it) }

        val mutations = controllers.filter { controller ->
            controller::class.memberFunctions.any { it.annotations.any { it is MutationMapping } }
        }.map { TopLevelObject(it) }

        val config = SchemaGeneratorConfig(
            supportedPackages = listOf("app.ehrenamtskarte.backend.graphql"),
            additionalTypes = setOf(
                GraphQLEnumType.newEnum()
                    .name("GraphQLExceptionCode")
                    .values(
                        GraphQLExceptionCode.entries.map { code ->
                            GraphQLEnumValueDefinition.newEnumValueDefinition()
                                .name(code.name)
                                .value(code.name)
                                .build()
                        },
                    ).build(),
            ),
        )

        return toSchema(
            config = config,
            queries = queries,
            mutations = mutations,
            subscriptions = emptyList(),
        )
    }
}
