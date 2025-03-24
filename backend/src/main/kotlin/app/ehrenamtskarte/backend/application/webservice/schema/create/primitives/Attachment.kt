package app.ehrenamtskarte.backend.application.webservice.schema.create.primitives

import app.ehrenamtskarte.backend.application.webservice.schema.view.AttachmentView
import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type

data class UploadKey(
    // This index allows to access the file using GraphQLContext.files[index]
    val index: Int,
)

data class Attachment(val data: UploadKey) {
    fun toJsonField(fieldName: String) = JsonField(fieldName, Type.Attachment, AttachmentView.from(this))
}
