package app.ehrenamtskarte.backend

import app.ehrenamtskarte.backend.common.database.Database
import app.ehrenamtskarte.backend.common.webservice.GraphQLHandler
import app.ehrenamtskarte.backend.common.webservice.WebService
import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.config.Environment
import app.ehrenamtskarte.backend.migration.MigrationUtils
import app.ehrenamtskarte.backend.migration.database.Migrations
import app.ehrenamtskarte.backend.stores.importer.Importer
import com.expediagroup.graphql.generator.extensions.print
import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.core.Context
import com.github.ajalt.clikt.core.ProgramResult
import com.github.ajalt.clikt.core.main
import com.github.ajalt.clikt.core.obj
import com.github.ajalt.clikt.core.requireObject
import com.github.ajalt.clikt.core.subcommands
import com.github.ajalt.clikt.parameters.arguments.argument
import com.github.ajalt.clikt.parameters.options.convert
import com.github.ajalt.clikt.parameters.options.option
import com.github.ajalt.clikt.parameters.types.choice
import com.github.ajalt.clikt.parameters.types.file
import org.jetbrains.exposed.sql.exists
import org.jetbrains.exposed.sql.transactions.transaction
import java.io.File
import java.util.TimeZone

class Entry : CliktCommand() {
    private val config by option().file(canBeDir = false, mustBeReadable = true)

    // Options to overwrite single properties of the config
    private val environment by option().choice("development", "staging", "production")
        .convert { Environment.fromString(it) }
    private val postgresUrl by option()
    private val postgresUser by option()
    private val postgresPassword by option()
    private val geocoding by option().choice("true", "false").convert { it.toBoolean() }
    private val geocodingHost by option()

    override fun run() {
        val backendConfiguration = BackendConfiguration.load(config?.toURI()?.toURL())

        currentContext.obj = backendConfiguration.copy(
            environment = environment ?: backendConfiguration.environment,
            postgres = backendConfiguration.postgres.copy(
                url = postgresUrl ?: backendConfiguration.postgres.url,
                user = postgresUser ?: backendConfiguration.postgres.user,
                password = postgresPassword ?: backendConfiguration.postgres.password,
            ),
            geocoding = backendConfiguration.geocoding.copy(
                enabled = geocoding ?: backendConfiguration.geocoding.enabled,
                host = geocodingHost ?: backendConfiguration.geocoding.host,
            ),
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

class ImportSingle : CliktCommand(name = "import-single") {
    private val config by requireObject<BackendConfiguration>()
    private val projectId by argument()
    private val importUrl by option()

    override fun help(context: Context): String = "Imports stores for single project."

    override fun run() {
        val projects =
            config.projects.map {
                if (it.id == projectId && importUrl != null) {
                    it.copy(importUrl = importUrl!!)
                } else {
                    it
                }
            }
        val newConfig = config.copy(projects = projects)

        Database.setup(newConfig)
        if (!Importer.import(newConfig.toImportConfig(projectId))) {
            throw ProgramResult(statusCode = 5)
        }
    }
}

class Import : CliktCommand(name = "import") {
    private val config by requireObject<BackendConfiguration>()

    override fun help(context: Context): String = "Imports stores for all projects."

    override fun run() {
        Database.setup(config)
        // Run import for all projects and exit with status code if one import failed
        config.projects
            .map { Importer.import(config.toImportConfig(it.id)) }
            .forEach { success -> if (!success) throw ProgramResult(statusCode = 5) }
    }
}

class CreateAdmin : CliktCommand(name = "create-admin") {
    private val config by requireObject<BackendConfiguration>()

    private val project by argument()
    private val role by argument()
    private val email by argument()
    private val password by argument()

    override fun help(context: Context): String = "Creates an admin account with the specified email and password"

    override fun run() {
        Database.setup(config)
        Database.createAccount(project, email, password, role)
    }
}

class Execute : CliktCommand() {
    private val config by requireObject<BackendConfiguration>()

    override fun help(context: Context): String = "Starts the webserver"

    override fun run() {
        Database.setup(config)
        WebService().start(config)
    }
}

class Migrate : CliktCommand(name = "migrate") {
    private val config by requireObject<BackendConfiguration>()

    override fun help(context: Context): String = "Migrates the database"

    override fun run() {
        val db = Database.setupWithoutMigrationCheck(config)
        MigrationUtils.applyRequiredMigrations(db)
    }
}

class MigrateSkipBaseline : CliktCommand() {
    private val config by requireObject<BackendConfiguration>()

    override fun help(context: Context): String =
        """
        Applies all migrations except for the baseline step.
        
        This command allows the production system to be upgraded to the new DB migration system.
        It adds the migrations table without applying the baseline migration step.
        It should be used only once when introducing the new DB migration system on the production server.
        Once this is done, this command can be safely removed.
        """.trimIndent()

    override fun run() {
        val db = Database.setupWithoutMigrationCheck(config)
        if (transaction { Migrations.exists() }) {
            throw IllegalArgumentException(
                "The migrations table has already been created. Use the migrate command instead.",
            )
        }
        MigrationUtils.applyRequiredMigrations(db, skipBaseline = true)
    }
}

fun main(args: Array<String>) {
    // Set the default time zone to UTC in order to make timestamps work properly in every configuration.
    TimeZone.setDefault(TimeZone.getTimeZone("UTC"))

    Entry().subcommands(
        Execute(),
        Import(),
        ImportSingle(),
        Migrate(),
        MigrateSkipBaseline(),
        CreateAdmin(),
        GraphQLExport(),
    ).main(args)
}
