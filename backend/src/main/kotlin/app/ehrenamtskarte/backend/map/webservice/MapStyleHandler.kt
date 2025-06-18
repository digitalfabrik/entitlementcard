package app.ehrenamtskarte.backend.map.webservice

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.exception.service.ProjectNotFoundException
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ArrayNode
import com.fasterxml.jackson.databind.node.JsonNodeFactory
import com.fasterxml.jackson.databind.node.ObjectNode
import io.javalin.http.Context
import java.io.BufferedReader
import java.io.IOException

class MapStyleHandler(config: BackendConfiguration) {
    private var styles: Map<String, String>

    init {
        val mapper = ObjectMapper()

        this.styles = config.projects.associate { project ->
            val style = loadStyle() ?: throw Exception("Unable to parse style.json")
            val newStyle = patchStyle(style) { id: String, source: JsonNode ->
                val newSource = source.deepCopy<ObjectNode>()

                val baseUrl = config.map.baseUrl

                if (id == "physical_stores") {
                    val tiles = ArrayNode(JsonNodeFactory.instance)
                    tiles.add(baseUrl + "?project_id=" + project.id)
                    newSource.replace("tiles", tiles)
                } else if (id == "physical_stores_clustered") {
                    val tiles = ArrayNode(JsonNodeFactory.instance)
                    tiles.add(baseUrl + "?clustered=true&project_id=" + project.id)
                    newSource.replace("tiles", tiles)
                }

                Pair(id, newSource)
            }

            val json = mapper.writeValueAsString(newStyle) ?: throw Exception("Failed to create style.json")

            Pair(project.id, json)
        }
    }

    private fun patchStyle(
        style: JsonNode,
        patcher: (id: String, source: JsonNode) -> Pair<String, JsonNode>,
    ): JsonNode? {
        val sources = style["sources"] ?: return null

        val newSources = sources.properties().asSequence().map {
            patcher(it.key, it.value)
        }.toMap()

        val newSourcesObject = ObjectNode(JsonNodeFactory.instance, newSources)

        val newStyle = style.deepCopy<ObjectNode>() ?: return null

        newStyle.replace("sources", newSourcesObject)

        return newStyle
    }

    private fun loadStyle(): JsonNode? {
        val mapper = ObjectMapper()
        val resource =
            ClassLoader.getSystemResource("styles/style.json") ?: throw Error("Map style 'style.json' is missing!'")

        val reader = BufferedReader(resource.openStream().reader(Charsets.UTF_8))
        val text = reader.readText()
        return mapper.readTree(text)
    }

    fun getPath(): String = "/project/{project_id}/map"

    fun handle(context: Context) {
        try {
            val projectId: String = context.pathParam("project_id")
            val style: String = this.styles[projectId] ?: throw ProjectNotFoundException(projectId)
            context.result(style)
            context.contentType("application/json")
        } catch (e: IOException) {
            context.res().sendError(500)
        }
    }
}
