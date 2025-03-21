package app.ehrenamtskarte.backend.application.webservice.schema.view

import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.Attachment
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidJsonException
import com.expediagroup.graphql.generator.annotations.GraphQLIgnore

enum class Type {
    String,
    Number,
    Array,
    Attachment,
    Boolean,
    Date,
    TranslatableString
}

data class AttachmentView(val fileIndex: Int) {
    @GraphQLIgnore
    companion object {
        fun from(attachment: Attachment) = AttachmentView(attachment.data.index)
    }
}

data class JsonField(
    val name: String,
    val type: Type,
    val value: Any
) {
    init {
        when (type) {
            Type.String -> if (value !is String) throw InvalidJsonException("Expected String.")
            Type.Number -> if (value !is Number) throw InvalidJsonException("Expected Number.")
            Type.Array -> if (!isListOfJsonFields(value)) throw InvalidJsonException("Expected List of JsonFields.")
            Type.Attachment -> if (value !is AttachmentView) throw InvalidJsonException("Expected AttachmentView.")
            Type.Boolean -> if (value !is Boolean) throw InvalidJsonException("Expected Boolean.")
            Type.Date -> if (value !is String) throw InvalidJsonException("Expected String for Date.")
            Type.TranslatableString -> if (value !is String) throw InvalidJsonException("Expected TranslatableString.")
        }
    }
}

fun isListOfJsonFields(value: Any) = value is List<*> && value.all { it is JsonField }
