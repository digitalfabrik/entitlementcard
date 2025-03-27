import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import java.io.File
import java.io.StringReader
import java.util.*

object CommandLine {
    private val cache: MutableMap<Pair<List<String>, String>, String> = mutableMapOf()

    fun execute(command: List<String>, workingDir: File): String {
        val cacheKey = Pair(command, workingDir.absolutePath)
        val item = cache[cacheKey]
        if (item != null) return item

        val process = ProcessBuilder(command)
            .directory(workingDir)
            .redirectError(ProcessBuilder.Redirect.INHERIT)
            .redirectOutput(ProcessBuilder.Redirect.PIPE)
            .start()
        process.waitFor()
        val status = process.exitValue()
        if (status != 0)
            throw Error("Command $command at $workingDir failed with status code $status!")
        val stdOut = process.inputStream.bufferedReader().readText()
        cache[cacheKey] = stdOut
        return stdOut
    }
}


@Serializable
data class BuildConfig(
    val appName: String,
    val applicationId: String,
    val appIcon: String,
    val buildFeatures: BuildFeatures
)

@Serializable
data class BuildFeatures(val excludeX86: Boolean, val excludeLocationPlayServices: Boolean)

private val json = Json { ignoreUnknownKeys = true }

fun readBuildConfig(buildConfigName: String): BuildConfig {
    val jsonString = CommandLine.execute(
        listOf("npx", "app-toolbelt", "v0", "build-config", "to-json", buildConfigName, "android"),
        File(System.getProperty("user.dir"))
    )
    return json.decodeFromString(jsonString)
}

data class ResValue(val type: String, val name: String, val value: String)

fun readResValues(buildConfigName: String): List<ResValue> {
    val resString = CommandLine.execute(
        listOf("npx", "app-toolbelt", "v0", "build-config", "to-properties", buildConfigName, "android"),
        File(System.getProperty("user.dir"))
    )
    val props = Properties()
    props.load(StringReader(resString))
    return props.map {
        val escaped = (it.value as String).replace("%", "\\\\u0025")
        // Make build config values available as string resource, e.g. for use in AndroidManifest
        ResValue("string", it.key as String, "\"$escaped\"")
    }
}
