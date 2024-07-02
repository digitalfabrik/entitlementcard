package app.ehrenamtskarte.backend.user

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonPropertyOrder

@JsonPropertyOrder(alphabetic = true)
data class KoblenzUser(@get:JsonProperty("1") val fullname: String, @get:JsonProperty("2") val birthday: Int, @get:JsonProperty("3") val referenceNumber: String)
