package app.ehrenamtskarte.backend

import app.ehrenamtskarte.backend.common.database.Database
import app.ehrenamtskarte.backend.common.webservice.GraphQLHandler
import app.ehrenamtskarte.backend.common.webservice.WebService
import app.ehrenamtskarte.backend.stores.importer.DataImporter
import com.expediagroup.graphql.extensions.print
import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.core.ProgramResult
import com.github.ajalt.clikt.parameters.options.flag
import com.github.ajalt.clikt.parameters.options.option
import java.io.File


class Entry : CliktCommand() {
    private val exportApi by option(help = "Export GraphQL schema. Given ")
    private val importFlag by option("--import").flag()

    override fun run() {
        val production = System.getProperty("app.production", "").isNotEmpty()

        val exportApi = exportApi
        if (exportApi != null) {
            val schema = GraphQLHandler().graphQLSchema.print()
            val file = File(exportApi)
            file.writeText(schema)
        } else {
            Database.setup(!production)
            if (importFlag) {
                println("Importing data from Lbe")
                if (!DataImporter.import(!production)) {
                    throw ProgramResult(statusCode = 5)
                }
            } else {
                WebService().start(production)
            }
        }
    }
}

fun main(argv: Array<String>) = Entry().main(argv)
