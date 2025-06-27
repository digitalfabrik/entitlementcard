package app.ehrenamtskarte.backend.cards.webservice.schema.types

import java.time.Instant

@Suppress("ktlint:standard:enum-entry-name-case")
enum class ActivationState {
    success,
    did_not_overwrite_existing,
    revoked,
    failed,
}

@Suppress("ktlint:standard:enum-entry-name-case")
enum class ActivationFailureReason {
    not_found,
    wrong_secret,
    expired,
}

data class CardActivationResultModel(
    val activationState: ActivationState,
    val totpSecret: String? = null,
    val failureReason: ActivationFailureReason? = null,
    val activationTimeStamp: String = Instant.now().toString(),
)
