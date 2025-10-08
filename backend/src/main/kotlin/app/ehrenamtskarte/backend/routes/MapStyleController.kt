package app.ehrenamtskarte.backend.routes

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.shared.exceptions.ProjectNotFoundException
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ArrayNode
import com.fasterxml.jackson.databind.node.JsonNodeFactory
import com.fasterxml.jackson.databind.node.ObjectNode
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController

@RestController
class MapStyleController(
    @Suppress("SpringJavaInjectionPointsAutowiringInspection")
    private val config: BackendConfiguration,
) {
    private val styles: Map<String, String> = initializeStyles()

    @GetMapping("/project/{projectId}/map")
    @Operation(
        summary = "Returns the style for a specific project",
        description = "Returns the style as a JSON string",
    )
    fun handle(
        @Parameter(description = "ID of the project")
        @PathVariable projectId: String,
    ): ResponseEntity<String> {
        val style = styles[projectId] ?: throw ProjectNotFoundException(projectId)
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(style)
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

    private fun loadStyle(): JsonNode? =
        ObjectMapper().let { mapper ->
            val resource = ClassLoader.getSystemResource("styles/style.json")
            mapper.readTree(resource.openStream().buffered())
        }
}
