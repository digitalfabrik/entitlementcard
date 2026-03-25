package app.ehrenamtskarte.backend.graphql.freinet.types

data class FreinetCardTransferResult(
    val successCount: Int,
    val failedUserIds: List<Int>,
)
