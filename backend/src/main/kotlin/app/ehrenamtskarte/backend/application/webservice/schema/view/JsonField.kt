package app.ehrenamtskarte.backend.application.webservice.schema.view

import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.Attachment
import com.expediagroup.graphql.generator.annotations.GraphQLIgnore

enum class Type {
    String,
    Number,
    Array,
    Attachment,
    Boolean,
    Date
}

data class AttachmentView(val fileIndex: Int) {
    @GraphQLIgnore
    companion object {
        fun from(attachment: Attachment) = AttachmentView(attachment.data.index)
    }
}

data class JsonField(
    val name: String,
    val translations: Map<String, String>,
    val type: Type,
    val value: Any
) {
    init {
        when (type) {
            Type.String -> if (value !is String) throw IllegalArgumentException("Expected String.")
            Type.Number -> if (value !is Number) throw IllegalArgumentException("Expected Number.")
            Type.Array -> if (!isListOfJsonFields(value)) throw IllegalArgumentException("Expected List of JsonFields.")
            Type.Attachment -> if (value !is AttachmentView) throw IllegalArgumentException("Expected AttachmentView.")
            Type.Boolean -> if (value !is Boolean) throw IllegalArgumentException("Expected Boolean.")
            Type.Date -> if (value !is String) throw IllegalArgumentException("Expected String for Date.")
        }
    }
}

fun isListOfJsonFields(value: Any) = value is List<*> && value.all { it is JsonField }
