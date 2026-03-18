package app.ehrenamtskarte.backend.graphql.cards.types

import com.expediagroup.graphql.generator.annotations.GraphQLDescription

@GraphQLDescription("Result of sending card creation confirmation emails")
data class CardCreationConfirmationMailResult(
    val successCount: Int,
    val failedRecipients: List<String>,
)
