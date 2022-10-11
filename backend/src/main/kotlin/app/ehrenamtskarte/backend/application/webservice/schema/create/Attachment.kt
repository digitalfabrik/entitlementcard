package app.ehrenamtskarte.backend.application.webservice.schema.create

import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import com.expediagroup.graphql.generator.annotations.GraphQLIgnore
import graphql.schema.DataFetchingEnvironment
import jakarta.servlet.http.Part

data class UploadKey(val index: Int)

data class Attachment(
    val fileName: String,
    val data: UploadKey
) {
    @GraphQLIgnore
    fun getPart(dataFetchingEnvironment: DataFetchingEnvironment): Part {
        val context = dataFetchingEnvironment.getContext<GraphQLContext>()
            ?: throw IllegalArgumentException("No files attached!")
        return context.files[data.index]
    }
}
