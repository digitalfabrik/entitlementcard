package app.ehrenamtskarte.backend

import app.ehrenamtskarte.backend.common.database.Database
import app.ehrenamtskarte.backend.common.webservice.GraphQLHandler
import app.ehrenamtskarte.backend.common.webservice.WebService
import app.ehrenamtskarte.backend.stores.importer.LbeDataImporter
import com.expediagroup.graphql.extensions.print
import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.core.ProgramResult
import com.github.ajalt.clikt.core.subcommands
import com.github.ajalt.clikt.parameters.arguments.argument
import java.io.File

class Entry : CliktCommand() {
    companion object {
        fun isProductionEnvironment(): Boolean {
            return System.getProperty("app.production", "").isNotEmpty()
        }
    }

    override fun run() {
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
    override fun run() {
        val production = Entry.isProductionEnvironment()
        Database.setup(!production)
        if (!LbeDataImporter.import(!production)) {
            throw ProgramResult(statusCode = 5)
        }
    }
}

class CreateAdmin : CliktCommand(help = "Creates an admin account with the specified email and password") {
    private val email by argument(
        help = "The email"
    )

    private val password by argument(
        help = "The password"
    )

    override fun run() {
        val production = Entry.isProductionEnvironment()
        Database.setup(!production)
        Database.createAccount(email, password)
    }
}

class Execute : CliktCommand(help = "Starts the webserver") {
    override fun run() {
        val production = Entry.isProductionEnvironment()
        Database.setup(!production)
        WebService().start(production)
    }
}

fun main(args: Array<String>) = Entry().subcommands(Execute(), Import(), CreateAdmin(), GraphQLExport()).main(args)
