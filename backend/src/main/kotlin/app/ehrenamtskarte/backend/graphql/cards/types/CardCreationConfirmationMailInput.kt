package app.ehrenamtskarte.backend.graphql.cards.types

import com.expediagroup.graphql.generator.annotations.GraphQLDescription

@GraphQLDescription("Input for a single card creation confirmation mail")
data class CardCreationConfirmationMailInput(
    val recipientAddress: String,
    val recipientName: String,
    val deepLink: String,
)
