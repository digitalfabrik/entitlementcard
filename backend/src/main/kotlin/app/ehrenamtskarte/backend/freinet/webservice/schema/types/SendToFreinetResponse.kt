package app.ehrenamtskarte.backend.freinet.webservice.schema.types

data class SendToFreinetResponse(
    val success: Boolean,
    val errorMessage: String? = null,
)
