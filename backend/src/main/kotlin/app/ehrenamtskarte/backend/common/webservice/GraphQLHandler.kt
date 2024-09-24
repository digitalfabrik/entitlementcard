package app.ehrenamtskarte.backend.common.webservice

import app.ehrenamtskarte.backend.application.webservice.applicationGraphQlParams
import app.ehrenamtskarte.backend.auth.webservice.JwtService
import app.ehrenamtskarte.backend.auth.webservice.authGraphQlParams
import app.ehrenamtskarte.backend.cards.webservice.cardsGraphQlParams
import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.NotFoundException
import app.ehrenamtskarte.backend.exception.service.NotImplementedException
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.exception.webservice.ExceptionSchemaConfig
import app.ehrenamtskarte.backend.regions.utils.PostalCodesLoader
import app.ehrenamtskarte.backend.regions.webservice.regionsGraphQlParams
import app.ehrenamtskarte.backend.stores.webservice.storesGraphQlParams
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
import io.javalin.http.Context
import io.javalin.http.util.MultipartUtil
import jakarta.servlet.http.Part
import java.io.File
import java.io.IOException
import java.util.concurrent.ExecutionException

class GraphQLHandler(
    private val backendConfiguration: BackendConfiguration,
    private val graphQLParams: GraphQLParams =
        storesGraphQlParams stitch cardsGraphQlParams
            stitch applicationGraphQlParams stitch regionsGraphQlParams stitch authGraphQlParams,
    private val regionIdentifierByPostalCode: List<Pair<String, String>> = PostalCodesLoader.loadRegionIdentifierByPostalCodeMap()
) {
    val config: SchemaGeneratorConfig = graphQLParams.config
        .plus(SchemaGeneratorConfig(listOf("app.ehrenamtskarte.backend.common.webservice.schema")))
        .plus(ExceptionSchemaConfig)

    val graphQLSchema = toSchema(
        config,
        graphQLParams.queries,
        graphQLParams.mutations,
        graphQLParams.subscriptions
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
        } catch (_: NullPointerException) {}

        return result
    }

    private fun getGraphQLContext(context: Context, files: List<Part>, remoteIp: String, applicationData: File) =
        try {
            GraphQLContext(
                applicationData,
                JwtService.verifyRequest(context),
                files,
                remoteIp,
                backendConfiguration,
                regionIdentifierByPostalCode,
                context.req()
            )
        } catch (e: Exception) {
            when (e) {
                is JWTDecodeException, is AlgorithmMismatchException, is SignatureVerificationException,
                is InvalidClaimException, is TokenExpiredException
                -> GraphQLContext(
                    applicationData,
                    null,
                    files,
                    remoteIp,
                    backendConfiguration,
                    regionIdentifierByPostalCode,
                    context.req()
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

            val variables = payload.getOrDefault("variables", emptyMap<String, Any>()) as Map<String, Any>?
            val executionInput =
                ExecutionInput.Builder()
                    .context(graphQLContext)
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
