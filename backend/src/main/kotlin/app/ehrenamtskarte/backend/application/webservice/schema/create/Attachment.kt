package app.ehrenamtskarte.backend.application.webservice.schema.create

data class UploadKey(
    // This index allows to access the file using GraphQLContext.files[index]
    val index: Int
)

data class Attachment(val data: UploadKey)
