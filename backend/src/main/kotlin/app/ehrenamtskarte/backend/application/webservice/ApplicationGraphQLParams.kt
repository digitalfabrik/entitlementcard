package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.application.webservice.dataloader.applicationLoader
import app.ehrenamtskarte.backend.application.webservice.dataloader.verificationsByApplicationLoader
import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.UploadKey
import app.ehrenamtskarte.backend.common.webservice.GraphQLParams
import app.ehrenamtskarte.backend.common.webservice.createRegistryFromNamedDataLoaders
import com.expediagroup.graphql.generator.SchemaGeneratorConfig
import com.expediagroup.graphql.generator.TopLevelObject
import com.expediagroup.graphql.generator.hooks.SchemaGeneratorHooks
import graphql.scalars.ExtendedScalars.GraphQLLong
import graphql.schema.Coercing
import graphql.schema.CoercingParseLiteralException
import graphql.schema.CoercingParseValueException
import graphql.schema.CoercingSerializeException
import graphql.schema.GraphQLScalarType
import graphql.schema.GraphQLType
import kotlin.reflect.KType

val Upload: GraphQLScalarType = GraphQLScalarType.newScalar()
    .name("Upload")
    .description("A file part in a multipart request")
    .coercing(object : Coercing<UploadKey?, Void?> {
        @Deprecated("Deprecated in Java")
        override fun serialize(dataFetcherResult: Any): Void? =
            throw CoercingSerializeException("Upload is an input-only type")

        @Deprecated("Deprecated in Java")
        override fun parseValue(input: Any): UploadKey =
            if (input is Int) {
                UploadKey(index = input)
            } else {
                throw CoercingParseValueException(
                    "Expected type " +
                        Int::class.java.name +
                        " but was " +
                        input.javaClass.name,
                )
            }

        @Deprecated("Deprecated in Java")
        override fun parseLiteral(input: Any): UploadKey =
            throw CoercingParseLiteralException(
                "Must use variables to specify Upload values",
            )
    })
    .build()

val applicationGraphQlParams = GraphQLParams(
    config = SchemaGeneratorConfig(
        supportedPackages = listOf("app.ehrenamtskarte.backend.application.webservice.schema"),
        hooks = object : SchemaGeneratorHooks {
            override fun willGenerateGraphQLType(type: KType): GraphQLType? =
                when (type.classifier) {
                    UploadKey::class -> Upload
                    Long::class -> GraphQLLong
                    else -> null
                }
        },
    ),
    dataLoaderRegistry = createRegistryFromNamedDataLoaders(
        applicationLoader,
        verificationsByApplicationLoader,
    ),
    queries = listOf(
        TopLevelObject(EakApplicationQueryService()),
    ),
    mutations = listOf(
        TopLevelObject(EakApplicationMutationService()),
    ),
)
