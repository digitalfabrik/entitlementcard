package app.ehrenamtskarte.backend.graphql.application.multipart

import app.ehrenamtskarte.backend.graphql.application.types.primitives.UploadKey
import graphql.GraphQLContext
import graphql.execution.CoercedVariables
import graphql.language.Value
import graphql.schema.Coercing
import graphql.schema.CoercingParseLiteralException
import graphql.schema.CoercingParseValueException
import graphql.schema.CoercingSerializeException
import org.springframework.web.multipart.MultipartFile
import java.util.Locale

class UploadCoercing : Coercing<UploadKey?, Void?> {
    @Throws(CoercingSerializeException::class)
    override fun serialize(dataFetcherResult: Any, graphQLContext: GraphQLContext, locale: Locale): Nothing =
        throw CoercingSerializeException("Upload is an input-only type")

    @Throws(CoercingParseValueException::class)
    override fun parseValue(input: Any, graphQLContext: GraphQLContext, locale: Locale): UploadKey =
        when (input) {
            is Int -> UploadKey(index = input)
            is MultipartFile -> {
                val index = input.name.toIntOrNull()
                    ?: throw CoercingParseValueException("Expected numeric part name but got '${input.name}'")
                UploadKey(index = index)
            }
            else -> throw CoercingParseValueException(
                "Expected Int or MultipartFile but was ${input.javaClass.name}",
            )
        }

    @Throws(CoercingParseLiteralException::class)
    override fun parseLiteral(
        input: Value<*>,
        variables: CoercedVariables,
        graphQLContext: GraphQLContext,
        locale: Locale,
    ): Nothing = throw CoercingParseLiteralException("Parsing literal of 'MultipartFile' is not supported")
}
