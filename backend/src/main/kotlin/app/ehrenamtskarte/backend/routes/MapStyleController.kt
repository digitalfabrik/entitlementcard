package app.ehrenamtskarte.backend.routes

import app.ehrenamtskarte.backend.config.BackendConfiguration
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ArrayNode
import com.fasterxml.jackson.databind.node.JsonNodeFactory
import com.fasterxml.jackson.databind.node.ObjectNode
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import java.io.BufferedReader

@RestController
class MapStyleController(
    @Suppress("SpringJavaInjectionPointsAutowiringInspection")
    private val config: BackendConfiguration,
) {
    private var styles: Map<String, String> = initializeStyles()

    @GetMapping("/project/{project_id}/map")
    fun handle(
        @PathVariable project_id: String,
    ): String =
        try {
            val style: String =
                styles[project_id] ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found")
            style
        } catch (e: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.message)
        }

    private fun initializeStyles(): Map<String, String> {
        val mapper = ObjectMapper()
        return config.projects.associate { project ->
            val style = loadStyle() ?: throw Error("Map style 'style.json' is missing!")
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
            val json = mapper.writeValueAsString(newStyle) ?: throw Error("Failed to create style.json")
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
            ClassLoader.getSystemResource("styles/style.json") ?: throw Error("Map style 'style.json' is missing!")
        val reader = BufferedReader(resource.openStream().reader(Charsets.UTF_8))
        val text = reader.readText()
        return mapper.readTree(text)
    }
}
