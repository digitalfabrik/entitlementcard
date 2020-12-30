package xyz.elitese.ehrenamtskarte.webservice.schema.types

data class Address(
        val id: Int,
        val street: String,
        val postalCode: String,
        val location: String,
        val state: String
)
