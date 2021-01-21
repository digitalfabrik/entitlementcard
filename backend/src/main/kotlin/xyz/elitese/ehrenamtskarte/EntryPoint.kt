package xyz.elitese.ehrenamtskarte

import com.expediagroup.graphql.extensions.print
import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.parameters.options.flag
import com.github.ajalt.clikt.parameters.options.option
import xyz.elitese.ehrenamtskarte.common.webservice.WebService
import xyz.elitese.ehrenamtskarte.stores.database.Database
import xyz.elitese.ehrenamtskarte.stores.importer.freinet.FreinetDataImporter
import xyz.elitese.ehrenamtskarte.stores.importer.lbe.LbeDataImporter
import xyz.elitese.ehrenamtskarte.stores.webservice.GraphQLHandler
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
        }
    }
}

fun main(argv: Array<String>) = Entry().main(argv)
