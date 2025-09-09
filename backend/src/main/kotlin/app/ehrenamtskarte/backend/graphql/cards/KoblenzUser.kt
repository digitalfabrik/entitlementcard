package app.ehrenamtskarte.backend.graphql.cards

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonPropertyOrder

@JsonPropertyOrder(alphabetic = true)
data class KoblenzUser(
    @get:JsonProperty("1") val birthday: Int,
    @get:JsonProperty("2") val referenceNumber: String,
)
