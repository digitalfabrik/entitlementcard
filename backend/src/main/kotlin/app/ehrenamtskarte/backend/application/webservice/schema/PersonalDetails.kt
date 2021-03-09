package app.ehrenamtskarte.backend.application.webservice.schema

data class PersonalDetails(
    val title: String?,
    val forenames: String,
    val surname: String,
    val dateOfBirth: String,
    val telephone: String?,
    val street: String,
    val houseNumber: String,
    val addressSupplement: String?,
    val postalCode: String,
    val location: String,
    val emailAddress: String,
    val nationality: String?,
    val gender: String?
)
