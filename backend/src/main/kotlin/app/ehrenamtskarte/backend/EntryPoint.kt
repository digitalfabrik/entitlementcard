package app.ehrenamtskarte.backend

import app.ehrenamtskarte.backend.common.database.Database
import app.ehrenamtskarte.backend.common.webservice.GraphQLHandler
import app.ehrenamtskarte.backend.common.webservice.WebService
import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.stores.importer.Importer
import com.expediagroup.graphql.generator.extensions.print
import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.core.ProgramResult
import com.github.ajalt.clikt.core.requireObject
import com.github.ajalt.clikt.core.subcommands
import com.github.ajalt.clikt.parameters.arguments.argument
import com.github.ajalt.clikt.parameters.arguments.optional
import com.github.ajalt.clikt.parameters.options.convert
import com.github.ajalt.clikt.parameters.options.option
import com.github.ajalt.clikt.parameters.types.choice
import com.github.ajalt.clikt.parameters.types.file
import com.github.ajalt.clikt.parameters.types.int
import java.io.File

class Entry : CliktCommand() {
    private val config by option().file(canBeDir = false, mustBeReadable = true)

    // Options to overwrite single properties of the config
    private val production by option().choice("true", "false").convert { it.toBoolean() }
    private val postgresUrl by option()
    private val postgresUser by option()
    private val postgresPassword by option()
    private val geocoding by option().choice("true", "false").convert { it.toBoolean() }
    private val csvwriter by option().choice("true", "false").convert { it.toBoolean() }
    private val geocodingHost by option()
    override fun run() {
        val backendConfiguration = BackendConfiguration.load(config)

        currentContext.obj = backendConfiguration.copy(
            production = production ?: backendConfiguration.production,
            postgres = backendConfiguration.postgres.copy(
                url = postgresUrl ?: backendConfiguration.postgres.url,
                user = postgresUser ?: backendConfiguration.postgres.user,
                password = postgresPassword ?: backendConfiguration.postgres.password
            ),
            geocoding = backendConfiguration.geocoding.copy(
                enabled = geocoding ?: backendConfiguration.geocoding.enabled,
                host = geocodingHost ?: backendConfiguration.geocoding.host
            ),
            csvWriter = backendConfiguration.csvWriter.copy(
                enabled = csvwriter ?: backendConfiguration.csvWriter.enabled
            )
        )
    }
}

class GraphQLExport : CliktCommand(name = "graphql-export") {
    private val config by requireObject<BackendConfiguration>()
    private val path by argument(help = "Export GraphQL schema. Given ")

    override fun run() {
        val schema = GraphQLHandler(config).graphQLSchema.print()
        val file = File(path)
        file.writeText(schema)
    }
}

class ImportSingle : CliktCommand(help = "Imports stores for single project.") {
    private val config by requireObject<BackendConfiguration>()
    private val projectId by argument()
    private val importUrl by option()

    override fun run() {
        val projects =
            config.projects.map { if (it.id == projectId && importUrl != null) it.copy(importUrl = importUrl!!) else it }
        val newConfig = config.copy(projects = projects)

        Database.setup(newConfig)
        if (!Importer.import(newConfig.toImportConfig(projectId))) {
            throw ProgramResult(statusCode = 5)
        }
    }
}

class Import : CliktCommand(help = "Imports stores for all projects.") {
    private val config by requireObject<BackendConfiguration>()

    override fun run() {
        Database.setup(config)
        // Run import for all projects and exit with status code if one import failed
        config.projects
            .map { Importer.import(config.toImportConfig(it.id)) }
            .forEach { success -> if (!success) throw ProgramResult(statusCode = 5) }
    }
}

class CreateAdmin : CliktCommand(help = "Creates an admin account with the specified email and password") {
    private val config by requireObject<BackendConfiguration>()

    private val project by argument()
    private val role by argument()
    private val email by argument()
    private val password by argument()
    private val regionId by argument().int().optional()

    override fun run() {
        Database.setup(config)
        Database.createAccount(project, email, password, role, regionId)
    }
}

class Execute : CliktCommand(help = "Starts the webserver") {
    private val config by requireObject<BackendConfiguration>()

    override fun run() {
        Database.setup(config)
        WebService().start(config)
    }
}

fun main(args: Array<String>) =
    Entry().subcommands(Execute(), Import(), ImportSingle(), CreateAdmin(), GraphQLExport()).main(args)
