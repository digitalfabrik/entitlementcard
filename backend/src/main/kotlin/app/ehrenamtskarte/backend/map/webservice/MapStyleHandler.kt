package app.ehrenamtskarte.backend.map.webservice

import io.javalin.http.Context
import java.io.BufferedReader
import java.io.IOException

class MapStyleHandler {

    private fun loadStyle(): String {
        val resource = ClassLoader.getSystemResource("style.json")
            ?: throw Error("Map style 'style.json' is missing missing!'")

        val reader = BufferedReader(resource.openStream().reader(Charsets.UTF_8))
        return reader.readText()
    }
    
    fun handle(context: Context) {
        try {
            val projectId = context.queryParam<String>("project_id")
            context.result(loadStyle())
            context.contentType("application/json")
        } catch (e: IOException) {
            context.res.sendError(500)
        }
    }
}
