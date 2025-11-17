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
        val baseUrl = config.map.baseUrl
        val style = loadStyle() ?: throw Error("Map style 'style.json' is missing!")

        return config.projects.associate { project ->
            val newStyle = patchSources(style) { id: String, source: JsonNode ->
                id to source.deepCopy<ObjectNode>().also {
                    when (id) {
                        "physical_stores" -> {
                            it.replace(
                                "tiles",
                                ArrayNode(JsonNodeFactory.instance)
                                    .add("$baseUrl?project_id=${project.id}"),
                            )
                        }
                        "physical_stores_clustered" -> {
                            it.replace(
                                "tiles",
                                ArrayNode(JsonNodeFactory.instance)
                                    .add("$baseUrl?clustered=true&project_id=${project.id}"),
                            )
                        }
                    }
                }
            }

            project.id to (mapper.writeValueAsString(newStyle) ?: throw Error("Failed to create style.json"))
        }
    }

    private fun patchSources(
        style: ObjectNode,
        patcher: (id: String, source: ObjectNode) -> Pair<String, JsonNode>,
    ): ObjectNode =
        style.also { styleDocument ->
            styleDocument.replace(
                "sources",
                ObjectNode(
                    JsonNodeFactory.instance,
                    style["sources"].properties().asSequence().mapNotNull {
                        (it.value as? ObjectNode)?.let { value -> patcher(it.key, value) }
                    }.toMap(),
                ),
            )
        }

    private fun loadStyle(): ObjectNode? =
        ClassLoader.getSystemResource("styles/style.json").openStream().buffered().use {
            ObjectMapper().readTree(it) as? ObjectNode
        }
}
