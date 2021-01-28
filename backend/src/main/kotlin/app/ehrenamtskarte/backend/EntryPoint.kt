package app.ehrenamtskarte.backend

import app.ehrenamtskarte.backend.common.database.Database
import app.ehrenamtskarte.backend.common.webservice.WebService
import app.ehrenamtskarte.backend.stores.importer.freinet.FreinetDataImporter
import app.ehrenamtskarte.backend.stores.importer.lbe.LbeDataImporter
import app.ehrenamtskarte.backend.stores.webservice.StoresGraphQLHandler
import app.ehrenamtskarte.backend.verification.webservice.VerificationGraphQLHandler
import com.expediagroup.graphql.extensions.print
import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.parameters.options.flag
import com.github.ajalt.clikt.parameters.options.option
import graphql.schema.GraphQLSchema
import java.io.File


class Entry : CliktCommand() {
    private val exportStoresApi by option(help = "Export GraphQL schema of stores component.")
    private val exportVerificationApi by option(help = "Export GraphQL schema of verification component.")
    private val importFreinetData by option("--importFreinet").flag()
    private val importLbeData by option("--importLbe").flag()

    override fun run() {
        val didExportApi = maybeExportApis()
        if (didExportApi) return

        Database.setup()
        maybeImportStoreData()
        WebService().start()
    }

    private fun maybeExportApis(): Boolean =
        maybeExportApi(exportStoresApi, StoresGraphQLHandler.graphQLSchema, "stores").or(
        maybeExportApi(exportVerificationApi, VerificationGraphQLHandler.graphQLSchema, "verification"))

    private fun maybeExportApi(fileName: String?, schema: GraphQLSchema, apiName: String = "a"): Boolean {
        if (fileName == null) return false
        println("Exporting $apiName GraphQL API to $fileName")
        exportApi(fileName, schema)
        return true
    }

    private fun exportApi(fileName: String, schema: GraphQLSchema) = File(fileName).writeText(schema.print())

    private fun maybeImportStoreData() {
        if (importFreinetData) {
            println("Importing data from Freinet...")
            FreinetDataImporter.import()
        }
        if (importLbeData) {
            println("Importing data from Lbe")
            LbeDataImporter.import()
        }
    }

}

fun main(argv: Array<String>) = Entry().main(argv)
