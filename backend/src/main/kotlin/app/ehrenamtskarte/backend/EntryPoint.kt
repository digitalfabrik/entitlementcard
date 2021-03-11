package app.ehrenamtskarte.backend

import app.ehrenamtskarte.backend.common.database.Database
import app.ehrenamtskarte.backend.common.webservice.GraphQLHandler
import app.ehrenamtskarte.backend.common.webservice.WebService
import app.ehrenamtskarte.backend.stores.importer.DataImporter
import com.expediagroup.graphql.extensions.print
import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.parameters.options.flag
import com.github.ajalt.clikt.parameters.options.option
import java.io.File


class Entry : CliktCommand() {
    private val exportApi by option(help = "Export GraphQL schema. Given ")
    private val importFlag by option("--import").flag()

    override fun run() {
        val exportApi = exportApi
        if (exportApi != null) {
            val schema = GraphQLHandler().graphQLSchema.print()
            val file = File(exportApi)
            file.writeText(schema)
        } else {
            Database.setup()
            if (importFlag) {
                println("Importing data from Lbe")
                DataImporter.import(importFlag)
            } else {
                WebService().start()
            }
        }
    }
}

fun main(argv: Array<String>) = Entry().main(argv)
