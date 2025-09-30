package app.ehrenamtskarte.backend.graphql

import app.ehrenamtskarte.backend.db.repositories.RegionsRepository
import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode
import com.expediagroup.graphql.generator.SchemaGeneratorConfig
import com.expediagroup.graphql.generator.toSchema
import graphql.schema.GraphQLEnumType
import graphql.schema.GraphQLEnumType.newEnum
import graphql.schema.GraphQLEnumValueDefinition
import graphql.schema.GraphQLEnumValueDefinition.newEnumValueDefinition
import graphql.schema.GraphQLSchema
import app.ehrenamtskarte.backend.graphql.regions.types.Region
import org.dataloader.DataLoaderRegistry
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.ObjectProvider
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.graphql.execution.BatchLoaderRegistry
import org.springframework.graphql.execution.DataLoaderRegistrar
import org.springframework.graphql.execution.GraphQlSource
import reactor.core.publisher.Mono
import reactor.core.scheduler.Schedulers

@Configuration
class GraphQLConfiguration(
    private val graphQlParams: List<GraphQLParams>,
    registry: BatchLoaderRegistry
) {
    init {
        registry.forTypePair(Int::class.java, Region::class.java)
            .registerMappedBatchLoader { regionIds, _env ->
                Mono.fromCallable {
                    transaction {
                        RegionsRepository.findByIds(regionIds.toList())
                            .mapNotNull { entity ->
                                entity?.let { it.id.value to Region.fromDbEntity(it) }
                            }.toMap()
                    }
                }.subscribeOn(Schedulers.boundedElastic())
            }
    }

    private val baseConfig = SchemaGeneratorConfig(
        listOf("app.ehrenamtskarte.backend.graphql.shared.types", "app.ehrenamtskarte.backend.graphql.regions.types"),
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
