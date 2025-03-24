package app.ehrenamtskarte.backend.exception.webservice

import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode
import com.expediagroup.graphql.generator.SchemaGeneratorConfig
import graphql.schema.GraphQLEnumType
import graphql.schema.GraphQLEnumValueDefinition

val codeEnumType = GraphQLEnumType.newEnum()
    .name("GraphQLExceptionCode")
    .values(
        GraphQLExceptionCode.values().map {
            GraphQLEnumValueDefinition.newEnumValueDefinition()
                .name(it.name)
                .value(it.name)
                .build()
        },
    )
    .build()

val ExceptionSchemaConfig = SchemaGeneratorConfig(
    listOf("app.ehrenamtskarte.backend.exception.webservice.schema"),
    additionalTypes = setOf(codeEnumType),
)
