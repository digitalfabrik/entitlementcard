package app.ehrenamtskarte.backend.graphql

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.graphql.application.applicationGraphQlParams
import app.ehrenamtskarte.backend.graphql.auth.JwtService
import app.ehrenamtskarte.backend.graphql.auth.authGraphQlParams
import app.ehrenamtskarte.backend.graphql.cards.cardsGraphQlParams
import app.ehrenamtskarte.backend.graphql.freinet.freinetGraphQlParams
import app.ehrenamtskarte.backend.graphql.regions.regionsGraphQlParams
import app.ehrenamtskarte.backend.graphql.CustomDataFetcherExceptionHandler
import app.ehrenamtskarte.backend.graphql.shared.exceptions.NotImplementedException
import app.ehrenamtskarte.backend.graphql.shared.schema.GraphQLExceptionCode
import app.ehrenamtskarte.backend.graphql.shared.substitute
import app.ehrenamtskarte.backend.graphql.stores.storesGraphQlParams
import app.ehrenamtskarte.backend.shared.exceptions.ForbiddenException
import app.ehrenamtskarte.backend.shared.exceptions.NotFoundException
import app.ehrenamtskarte.backend.shared.exceptions.UnauthorizedException
import com.auth0.jwt.exceptions.AlgorithmMismatchException
import com.auth0.jwt.exceptions.InvalidClaimException
import com.auth0.jwt.exceptions.JWTDecodeException
import com.auth0.jwt.exceptions.SignatureVerificationException
import com.auth0.jwt.exceptions.TokenExpiredException
import com.expediagroup.graphql.generator.SchemaGeneratorConfig
import com.expediagroup.graphql.generator.toSchema
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import graphql.ExceptionWhileDataFetching
import graphql.ExecutionInput
import graphql.ExecutionResult
import graphql.GraphQL
import graphql.schema.GraphQLEnumType
import graphql.schema.GraphQLEnumType.newEnum
import graphql.schema.GraphQLEnumValueDefinition
import graphql.schema.GraphQLEnumValueDefinition.newEnumValueDefinition
import io.javalin.http.Context
import io.javalin.http.util.MultipartUtil
import jakarta.servlet.http.Part
import org.apache.commons.csv.CSVFormat
import java.io.File
import java.io.IOException
import java.io.InputStream
import java.util.concurrent.ExecutionException

class GraphQLHandler(
    private val backendConfiguration: BackendConfiguration,
    private val graphQLParams: GraphQLParams =
        storesGraphQlParams stitch cardsGraphQlParams
            stitch applicationGraphQlParams stitch regionsGraphQlParams stitch authGraphQlParams stitch
            freinetGraphQlParams,
    private val regionIdentifierByPostalCode: List<Pair<String, String>> = loadRegionIdentifierByPostalCodeMap(),
) {
    val config: SchemaGeneratorConfig = graphQLParams.config
        .plus(
            SchemaGeneratorConfig(
                listOf("app.ehrenamtskarte.backend.graphql.shared.schema"),
                additionalTypes = setOf<GraphQLEnumType>(
                    newEnum()
                        .name("GraphQLExceptionCode")
                        .values(
                            GraphQLExceptionCode.values().map<GraphQLExceptionCode, GraphQLEnumValueDefinition> {
                                newEnumValueDefinition()
                                    .name(it.name)
                                    .value(it.name)
                                    .build()
                            },
                        )
                        .build(),
                ),
            ),
        )

    val graphQLSchema = toSchema(
        config,
        graphQLParams.queries,
        graphQLParams.mutations,
        graphQLParams.subscriptions,
    )
    private val graphQL = GraphQL.newGraphQL(graphQLSchema)
        .defaultDataFetcherExceptionHandler(CustomDataFetcherExceptionHandler()).build()!!

    private val mapper = jacksonObjectMapper()

    /**
     * Get payload from the request.
     */
    private fun getPayload(context: Context): Pair<Map<String, Any>, List<Part>> {
        return try {
            if (!context.isMultipart()) {
                Pair(mapper.readValue(context.body()), emptyList())
            } else {
                val servlet = context.req()
                MultipartUtil.preUploadFunction(servlet)
                val partsMap = servlet.parts.associateBy { it.name }
                val operationsJson =
                    partsMap["operations"]?.inputStream ?: throw IOException("Missing operations part.")
                val operations = mapper.readTree(operationsJson)
                val mapJson = partsMap["map"]?.inputStream
                    ?: return Pair(mapper.readValue(mapper.treeAsTokens(operations)), emptyList())

                val substitutions = mapper.readValue<Map<String, List<String>>>(mapJson)
                val files = servlet.parts.filter { substitutions.containsKey(it.name) }
                substitutions.forEach { (key, paths) ->
                    val index = files.indexOfFirst { it.name == key }
                    if (index == -1 || key == "operations" || key == "map") {
                        throw IllegalArgumentException("Part with key '$key' not found or invalid!")
                    }
                    paths.forEach { path -> operations.substitute(path, index, mapper) }
                }
                return Pair(mapper.readValue(mapper.treeAsTokens(operations)), files)
            }
        } catch (e: IOException) {
            throw IOException("Unable to parse GraphQL payload.")
        }
    }

    private fun getIpAddress(context: Context): String {
        val xRealIp = context.header("X-Real-IP")
        val xForwardedFor = context.header("X-Forwarded-For")
        val remoteAddress = context.req().remoteAddr

        return listOf(xRealIp, xForwardedFor, remoteAddress).firstNotNullOf { it }
    }

    /**
     * Get any errors and data from [executionResult].
     *
     * If there is an unknown exception it was wrapped by the exception handler in an ExceptionWhileDataFetching.
     * In this case, we rethrow it. The server will return either a 40x or 50x status with empty body (see [handle])
     */
    private fun getResult(executionResult: ExecutionResult): MutableMap<String, Any> {
        val result = mutableMapOf<String, Any>()

        if (executionResult.errors.isNotEmpty()) {
            executionResult.errors.forEach {
                if (it is ExceptionWhileDataFetching) {
                    throw it.exception
                }
            }

            result["errors"] = executionResult.errors
        }

        try {
            result["data"] = executionResult.getData<Any?>()
        } catch (_: NullPointerException) {
        }

        return result
    }

    private fun getGraphQLContext(
        context: Context,
        files: List<Part>,
        remoteIp: String,
        applicationData: File,
    ): GraphQLContext =
        try {
            GraphQLContext(
                applicationData,
                JwtService.verifyRequest(context),
                files,
                remoteIp,
                backendConfiguration,
                regionIdentifierByPostalCode,
                context.req(),
            )
        } catch (e: Exception) {
            when (e) {
                is JWTDecodeException, is AlgorithmMismatchException, is SignatureVerificationException,
                is InvalidClaimException, is TokenExpiredException,
                -> GraphQLContext(
                    applicationData,
                    null,
                    files,
                    remoteIp,
                    backendConfiguration,
                    regionIdentifierByPostalCode,
                    context.req(),
                )

                else -> throw e
            }
        }

    /**
     * Execute a query against schema
     */
    fun handle(context: Context, applicationData: File) {
        // Execute the query against the schema
        try {
            val (payload, files) = getPayload(context)
            val remoteIp = getIpAddress(context)
            val graphQLContext = getGraphQLContext(context, files, remoteIp, applicationData)

            val variables = payload.getOrDefault(
                "variables",
                emptyMap<String, Any>(),
            ) as Map<String, Any>?
            val executionInput =
                ExecutionInput.Builder()
                    .graphQLContext { it.put(graphQLContext) }
                    .query(payload["query"].toString())
                    .variables(variables ?: emptyMap<String, Any>())
                    .dataLoaderRegistry(graphQLParams.dataLoaderRegistry)
                    .build()

            val executionResult = graphQL.executeAsync(executionInput).get()
            val result = getResult(executionResult)

            // write response as json
            context.json(result)
        } catch (e: IOException) {
            context.res().sendError(500)
        } catch (e: NotImplementedException) {
            context.res().sendError(501, e.message)
        } catch (e: UnauthorizedException) {
            context.res().sendError(401)
        } catch (e: ForbiddenException) {
            context.res().sendError(403)
        } catch (e: NotFoundException) {
            context.res().sendError(404)
        } catch (e: ExecutionException) {
            e.printStackTrace()
            context.res().sendError(500)
        }
    }
}

private fun loadRegionIdentifierByPostalCodeMap(): List<Pair<String, String>> {
    try {
        val csvInput: InputStream = ClassLoader.getSystemResourceAsStream("import/plz_ort_bayern.csv")!!
        val records = CSVFormat.RFC4180.parse(csvInput.reader())
        val postalCodes = mutableListOf<Pair<String, String>>()
        records.forEachIndexed { index, record ->
            val headline = index == 0
            if (record[1].isNotEmpty() && !headline) {
                postalCodes.add(record[1] to '0' + record[0].substring(0, 4))
            }
        }
        // Since we shorten region codes we have to remove duplicate pairs
        return postalCodes.toSet().toList()
    } catch (e: Exception) {
        throw Exception("Couldn't read CSV", e)
    }
}
