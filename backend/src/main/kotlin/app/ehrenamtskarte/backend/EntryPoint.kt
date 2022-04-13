package app.ehrenamtskarte.backend

import app.ehrenamtskarte.backend.common.database.Database
import app.ehrenamtskarte.backend.common.webservice.GraphQLHandler
import app.ehrenamtskarte.backend.common.webservice.WebService
import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.stores.importer.LbeDataImporter
import com.expediagroup.graphql.extensions.print
import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.core.ProgramResult
import com.github.ajalt.clikt.core.requireObject
import com.github.ajalt.clikt.core.subcommands
import com.github.ajalt.clikt.parameters.arguments.argument
import com.github.ajalt.clikt.parameters.options.option
import com.github.ajalt.clikt.parameters.options.required
import com.github.ajalt.clikt.parameters.types.file
import java.io.File

class Entry : CliktCommand() {
    private val config by option().file(canBeDir = false, mustBeReadable = true).required()
    private val projectId by option().required()

    override fun run() {
        currentContext.obj = BackendConfiguration.from(config, projectId)
    }
}

class GraphQLExport : CliktCommand(name = "graphql-export") {
    private val path by argument(help = "Export GraphQL schema. Given ")

    override fun run() {
        val schema = GraphQLHandler().graphQLSchema.print()
        val file = File(path)
        file.writeText(schema)
    }
}

class Import : CliktCommand(help = "Imports stores from a configured data source. Various properties must be set.") {
    private val config by requireObject<BackendConfiguration>()

    override fun run() {
        Database.setup(config)
        if (!LbeDataImporter.import(config)) {
            throw ProgramResult(statusCode = 5)
        }
    }
}

class CreateAdmin : CliktCommand(help = "Creates an admin account with the specified email and password") {
    private val config by requireObject<BackendConfiguration>()

    private val email by argument()
    private val password by argument()

    override fun run() {
        Database.setup(config)
        Database.createAccount(email, password)
    }
}

class Execute : CliktCommand(help = "Starts the webserver") {
    private val config by requireObject<BackendConfiguration>()

    override fun run() {
        Database.setup(config)
        WebService().start(config)
    }
}

fun main(args: Array<String>) = Entry().subcommands(Execute(), Import(), CreateAdmin(), GraphQLExport()).main(args)
