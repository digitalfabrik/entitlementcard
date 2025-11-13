package app.ehrenamtskarte.backend

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.config.ConfigurationLoader
import app.ehrenamtskarte.backend.config.Environment
import app.ehrenamtskarte.backend.db.Database
import app.ehrenamtskarte.backend.db.entities.Migrations
import app.ehrenamtskarte.backend.db.migration.MigrationUtils
import app.ehrenamtskarte.backend.import.stores.Importer
import app.ehrenamtskarte.backend.import.stores.toImportConfig
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
import graphql.schema.GraphQLSchema
import org.jetbrains.exposed.sql.exists
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.LoggerFactory
import org.springframework.boot.WebApplicationType
import org.springframework.boot.runApplication
import org.springframework.context.support.beans
import java.io.File
import java.sql.SQLException
import java.util.TimeZone

private val logger by lazy { LoggerFactory.getLogger("EntryPoint") }

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
    private val disableMailService by option().choice("true", "false").convert { it.toBoolean() }

    override fun run() {
        val backendConfiguration = try {
            BackendConfiguration.load(ConfigurationLoader().findConfigurationUrl(config))
        } catch (e: IllegalStateException) {
            logger.error(e.message)
            throw ProgramResult(statusCode = 4)
        }

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
            disableMailService = disableMailService ?: backendConfiguration.disableMailService,
        )
    }
}

class DbImportDev : CliktCommand("db-import-dev") {
    private val directoryPath by argument(
        name = "directory",
        help = "Directory to load the SQL files from.",
    )
    private val config by requireObject<BackendConfiguration>()
    private val sqlFilePattern = Regex("""\.sql$""")

    override fun help(context: Context): String = "Import dummy developer data."

    override fun run() {
        val dir = File(directoryPath).absoluteFile

        if (dir.exists() && dir.isDirectory) {
            Database.setupWithoutMigrationCheck(config, log = false)

            dir.walk().forEach {
                if (it.isFile && sqlFilePattern.containsMatchIn(it.path)) {
                    logger.info("Loading SQL file: ${it.absolutePath.substring(dir.absolutePath.length + 1)}")
                    try {
                        Database.executeSqlFile(it)
                    } catch (err: SQLException) {
                        logger.error("Error in SQL file (code = ${err.errorCode}):\n${err.message}")
                        throw ProgramResult(statusCode = 4)
                    }
                }
            }
        } else {
            logger.error("Path '$dir' does not exist or is not a directory.")
            throw ProgramResult(statusCode = 4)
        }
    }
}

class GraphQLExport : CliktCommand("graphql-export") {
    private val config by requireObject<BackendConfiguration>()
    private val path by argument(help = "Export GraphQL schema. Given ")

    override fun help(context: Context): String = "Exports the GraphQL schema into the directory given by '--path'"

    override fun run() {
        val springContext = runApplication<BackendApplication> {
            webApplicationType = WebApplicationType.NONE
            addInitializers(
                beans {
                    bean { config }
                },
            )
        }
        try {
            val schema = springContext.getBean(GraphQLSchema::class.java)
            File(path).writeText(schema.print())
            logger.info("GraphQL schema successfully exported to '$path'")
        } finally {
            springContext.close()
        }
    }
}

class ImportSingle : CliktCommand("import-single") {
    private val config by requireObject<BackendConfiguration>()
    private val projectId by argument()
    private val importUrl by option()

    override fun help(context: Context): String = "Imports stores for single project."

    override fun run() {
        val projects = config.projects.map {
            if (it.id == projectId && importUrl != null) it.copy(importUrl = importUrl!!) else it
        }
        val newConfig = config.copy(projects = projects)

        Database.setupWithInitialDataAndMigrationChecks(newConfig)

        if (!Importer.import(newConfig.toImportConfig(projectId))) {
            throw ProgramResult(statusCode = 5)
        }
    }
}

class Import : CliktCommand("import") {
    private val config by requireObject<BackendConfiguration>()

    override fun help(context: Context): String = "Imports stores for all projects."

    override fun run() {
        Database.setupWithInitialDataAndMigrationChecks(config)
        // Run import for all projects and exit with status code if one import failed
        config.projects
            .map { Importer.import(config.toImportConfig(it.id)) }
            .forEach { success -> if (!success) throw ProgramResult(statusCode = 5) }
    }
}

class CreateAdmin : CliktCommand("create-admin") {
    private val config by requireObject<BackendConfiguration>()

    private val project by argument()
    private val role by argument()
    private val email by argument()
    private val password by argument()

    override fun help(context: Context): String = "Creates an admin account with the specified email and password"

    override fun run() {
        Database.setupWithInitialDataAndMigrationChecks(config)
        Database.createAccount(project, email, password, role)
    }
}

class Execute : CliktCommand() {
    private val config by requireObject<BackendConfiguration>()

    override fun help(context: Context): String = "Starts the webserver"

    override fun run() {
        Database.setupWithInitialDataAndMigrationChecks(config)
        runApplication<BackendApplication> {
            setAdditionalProfiles(config.environment.toString().lowercase())
            setDefaultProperties(
                mapOf(
                    "server.address" to config.server.host,
                    "server.port" to config.server.port,
                ),
            )
            addInitializers(
                beans {
                    bean { config }
                },
            )
        }
    }
}

class Migrate : CliktCommand("migrate") {
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

class DbClear : CliktCommand("db-clear") {
    private val config by requireObject<BackendConfiguration>()

    override fun help(context: Context): String = "Recreate the DB"

    override fun run() {
        Database.setupWithoutMigrationCheck(config)

        transaction {
            // See also https://github.com/postgis/docker-postgis/blob/master/17-master/initdb-postgis.sh
            exec(
                """
                drop schema "public" cascade ;
                create schema "public";
                create extension if not exists "postgis" schema "public";
                create extension if not exists "postgis_topology" ;
                create extension if not exists "fuzzystrmatch" ;
                create extension if not exists "postgis_tiger_geocoder" ;
                """,
            )
        }
    }
}

fun main(args: Array<String>) {
    // Set the default time zone to UTC in order to make timestamps work properly in every configuration.
    TimeZone.setDefault(TimeZone.getTimeZone("UTC"))

    Entry().subcommands(
        Execute(),
        Import(),
        ImportSingle(),
        DbImportDev(),
        Migrate(),
        MigrateSkipBaseline(),
        DbClear(),
        CreateAdmin(),
        GraphQLExport(),
    ).main(args)
}
