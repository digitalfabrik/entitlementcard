package app.ehrenamtskarte.backend.common.webservice

import app.ehrenamtskarte.backend.application.webservice.applicationGraphQlParams
import app.ehrenamtskarte.backend.auth.webservice.JwtService
import app.ehrenamtskarte.backend.auth.webservice.authGraphQlParams
import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.NotFoundException
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.exception.webservice.ExceptionSchemaConfig
import app.ehrenamtskarte.backend.regions.utils.PostalCodesLoader
import app.ehrenamtskarte.backend.regions.webservice.regionsGraphQlParams
import app.ehrenamtskarte.backend.stores.webservice.storesGraphQlParams
import app.ehrenamtskarte.backend.verification.webservice.verificationGraphQlParams
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
        storesGraphQlParams stitch verificationGraphQlParams
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
        .defaultDataFetcherExceptionHandler(GraphQLExceptionHandler()).build()!!

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

    private fun getIpAdress(context: Context): String {
        val xRealIp = context.header("X-Real-IP")
        val xForwardedFor = context.header("X-Forwarded-For")
        val remoteAddress = context.req().remoteAddr

        return listOf(xRealIp, xForwardedFor, remoteAddress).firstNotNullOf { it }
    }

    /**
     * Get any errors and data from [executionResult].
     */
    private fun getResult(executionResult: ExecutionResult): MutableMap<String, Any> {
        val result = mutableMapOf<String, Any>()

        if (executionResult.errors.isNotEmpty()) {
            // if we encounter duplicate errors while data fetching, only include one copy
            result["errors"] = executionResult.errors.distinctBy {
                if (it is ExceptionWhileDataFetching) {
                    it.exception
                } else {
                    it
                }
            }
            // if we encounter an UnauthorizedException, rethrow it
            executionResult.errors
                .filterIsInstance<ExceptionWhileDataFetching>()
                .map { it.exception }
                .firstOrNull { it is UnauthorizedException }
                ?.let { throw it }
        }

        try {
            // if data is null, get data will fail exceptionally
            result["data"] = executionResult.getData<Any>()
        } catch (_: Exception) {
        }

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
            val remoteIp = getIpAdress(context)
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
