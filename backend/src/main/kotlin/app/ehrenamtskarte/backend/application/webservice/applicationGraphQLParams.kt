package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.application.webservice.schema.create.UploadKey
import app.ehrenamtskarte.backend.common.webservice.GraphQLParams
import com.expediagroup.graphql.SchemaGeneratorConfig
import com.expediagroup.graphql.TopLevelObject
import com.expediagroup.graphql.hooks.SchemaGeneratorHooks
import graphql.schema.*
import org.dataloader.DataLoaderRegistry
import kotlin.reflect.KType

private fun createDataLoaderRegistry(): DataLoaderRegistry {
    val dataLoaderRegistry = DataLoaderRegistry()
    return dataLoaderRegistry
}

val Upload = GraphQLScalarType.newScalar()
    .name("Upload")
    .description("A file part in a multipart request")
    .coercing(object : Coercing<UploadKey?, Void?> {
        override fun serialize(dataFetcherResult: Any): Void? {
            throw CoercingSerializeException("Upload is an input-only type")
        }

        override fun parseValue(input: Any?): UploadKey? {
            return if (null == input) {
                null
            } else if (input is Int) {
                UploadKey(index = input)
            } else {
                throw CoercingParseValueException(
                    "Expected type " +
                            Int::class.java.name +
                            " but was " +
                            input.javaClass.name
                )
            }
        }

        override fun parseLiteral(input: Any): UploadKey? {
            throw CoercingParseLiteralException(
                "Must use variables to specify Upload values"
            )
        }
    })
    .build()


val applicationGraphQlParams = GraphQLParams(
    config = SchemaGeneratorConfig(
        supportedPackages = listOf("app.ehrenamtskarte.backend.application.webservice.schema"),
        hooks = object : SchemaGeneratorHooks {
            override fun willGenerateGraphQLType(type: KType): GraphQLType? =
                if (type.classifier == UploadKey::class) Upload else null
        }
    ),
    dataLoaderRegistry = createDataLoaderRegistry(),
    queries = listOf(),
    mutations = listOf(
        TopLevelObject(EakApplicationMutationService())
    )
)
