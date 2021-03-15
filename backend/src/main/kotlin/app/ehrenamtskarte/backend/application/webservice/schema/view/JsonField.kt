package app.ehrenamtskarte.backend.application.webservice.schema.view

import app.ehrenamtskarte.backend.application.webservice.schema.create.Attachment
import com.expediagroup.graphql.annotations.GraphQLIgnore

enum class Type {
    String,
    Number,
    Array,
    Attachment
}

data class AttachmentView(val fileName: String, val fileKey: String) {
    @GraphQLIgnore
    companion object {
        fun from(attachment: Attachment) = AttachmentView(attachment.fileName, attachment.data.key)
    }
}

data class JsonField(
    val name: String,
    val translations: Map<String, String>,
    val type: Type,
    val value: Any
)
