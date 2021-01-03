package xyz.elitese.ehrenamtskarte

import com.expediagroup.graphql.extensions.print
import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.parameters.options.flag
import com.github.ajalt.clikt.parameters.options.option
import app.ehrenamtskarte.administration.webservice.AdminWebService
import xyz.elitese.ehrenamtskarte.database.Database
import xyz.elitese.ehrenamtskarte.importer.freinet.FreinetDataImporter
import xyz.elitese.ehrenamtskarte.importer.lbe.LbeDataImporter
import xyz.elitese.ehrenamtskarte.webservice.GraphQLHandler
import xyz.elitese.ehrenamtskarte.webservice.WebService
import java.io.File


class Entry : CliktCommand() {
    private val exportApi by option(help = "Export GraphQL schema. Given ")
    private val importFreinetData by option("--importFreinet").flag()
    private val importLbeData by option("--importLbe").flag()

    override fun run() {
        val exportApi = exportApi
        if (exportApi != null) {
            val schema = GraphQLHandler.graphQLSchema.print()
            val file = File(exportApi)
            file.writeText(schema)
        } else {
            Database.setup()
            if (importFreinetData) {
                println("Importing data from Freinet...")
                FreinetDataImporter.import()
            }
            if (importLbeData) {
                println("Importing data from Lbe")
                LbeDataImporter.import()
            }
            WebService().start()
            AdminWebService().start()
        }
    }
}

fun main(argv: Array<String>) = Entry().main(argv)
