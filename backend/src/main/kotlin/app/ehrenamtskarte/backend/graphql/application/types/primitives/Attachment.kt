package app.ehrenamtskarte.backend.graphql.application.types.primitives

import app.ehrenamtskarte.backend.graphql.application.types.AttachmentView
import app.ehrenamtskarte.backend.graphql.application.types.JsonField
import app.ehrenamtskarte.backend.graphql.application.types.Type

data class UploadKey(
    // This index allows to access the file using GraphQLContext.files[index]
    val index: Int,
)

data class Attachment(val data: UploadKey) {
    fun toJsonField(fieldName: String) = JsonField(fieldName, Type.Attachment, AttachmentView.from(this))
}
