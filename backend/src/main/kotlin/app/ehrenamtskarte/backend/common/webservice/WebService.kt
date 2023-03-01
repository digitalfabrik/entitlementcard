package app.ehrenamtskarte.backend.common.webservice

import app.ehrenamtskarte.backend.application.webservice.ApplicationAttachmentHandler
import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.map.webservice.MapStyleHandler
import app.ehrenamtskarte.backend.regions.database.repos.RegionsRepository
import io.javalin.Javalin
import io.javalin.http.staticfiles.Location
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVRecord
import java.io.File
import java.io.FileReader
import kotlin.math.pow

class WebService {
    companion object {
        private val MIN_FREE_STORAGE = 2.0.pow(30)
    }

    fun start(config: BackendConfiguration) {
        val production = config.production
        val host = config.server.host
        val port = Integer.parseInt(config.server.port)
        val dataDirectory = config.server.dataDirectory

        val applicationData = File(dataDirectory, "applications")
        val postalCodes: Map<String, String> = RegionsRepository.getPostalCodes(readPostalCodesFromCSV())

        if (applicationData.exists()) {
            if (!applicationData.isDirectory) {
                throw Error("${applicationData.absolutePath} is not a directory. Set the property app.application-data correctly!")
            }
        } else {
            if (!applicationData.mkdirs()) {
                throw Error("Failed to create directory ${applicationData.absolutePath}")
            }
        }

        if (applicationData.usableSpace < MIN_FREE_STORAGE) {
            throw Error("You need at least 1GiB free storage for the application data!")
        }

        val app = Javalin.create { cfg ->
            if (!production) {
                cfg.plugins.enableDevLogging()
                cfg.plugins.enableCors { cors -> cors.add { it.anyHost() } }
            }
            cfg.staticFiles.add {
                it.directory = "/graphiql"
                it.hostedPath = "/graphiql"
                it.location = Location.CLASSPATH
            }
        }.start(host, port)

        println("Server is running at http://$host:$port")
        println("Goto http://$host:$port/graphiql/ for a graphical editor")

        val graphQLHandler = GraphQLHandler(config)
        val mapStyleHandler = MapStyleHandler(config)
        val applicationHandler = ApplicationAttachmentHandler(applicationData)

        app.post("/") { ctx ->
            if (!production) {
                ctx.header("Access-Control-Allow-Headers: Authorization")
                ctx.header("Access-Control-Allow-Origin: *")
            }
            graphQLHandler.handle(ctx, applicationData, postalCodes)
        }

        app.get(mapStyleHandler.getPath()) { ctx ->
            if (!production) {
                ctx.header("Access-Control-Allow-Headers: Authorization")
                ctx.header("Access-Control-Allow-Origin: *")
            }
            mapStyleHandler.handle(ctx)
        }

        app.get(applicationHandler.getPath()) { ctx ->
            applicationHandler.handle(ctx)
        }
    }

    private fun readPostalCodesFromCSV(): Iterable<CSVRecord> {
        try {

            val csvInput = FileReader(File(ClassLoader.getSystemResource("import/plz_ort_bayern.csv").toURI()))
            return CSVFormat.RFC4180.parse(csvInput)
        } catch (e: Exception) {
            throw Exception("Couldn't read CSV", e)
        }
    }
}
