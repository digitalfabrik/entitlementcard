package app.ehrenamtskarte.backend.application.webservice.schema.create

import com.expediagroup.graphql.annotations.GraphQLIgnore
import graphql.schema.DataFetchingEnvironment
import java.lang.IllegalArgumentException
import javax.servlet.http.Part

data class UploadKey (val key: String)

data class Attachment(
    val fileName: String,
    val data: UploadKey
) {
    @GraphQLIgnore
    fun getPart(dataFetchingEnvironment: DataFetchingEnvironment) : Part {
        val parts = dataFetchingEnvironment.getLocalContext<Map<String, Part>?>()
            ?: throw IllegalArgumentException("No files attached!")
        return parts[data.key] ?: throw IllegalArgumentException("Could not find attachment!")
    }
}
