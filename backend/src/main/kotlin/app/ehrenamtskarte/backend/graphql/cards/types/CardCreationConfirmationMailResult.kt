package app.ehrenamtskarte.backend.graphql.cards.types

data class CardCreationConfirmationMailResult(
    val successCount: Int,
    val failedRecipients: List<String>,
)
