package app.ehrenamtskarte.backend.regions.webservice.schema.types

data class Region(
    val id: Int,
    val prefix: String,
    val name: String,
    val regionIdentifier: String?,
    val dataPrivacyPolicy: String?,
    val activatedForApplication: Boolean,
    val activatedForCardConfirmationMail: Boolean,
)
