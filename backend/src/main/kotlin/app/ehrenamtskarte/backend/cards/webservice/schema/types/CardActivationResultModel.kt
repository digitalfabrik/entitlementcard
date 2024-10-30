package app.ehrenamtskarte.backend.cards.webservice.schema.types

import java.time.Instant

@Suppress("ktlint:enum-entry-name-case")
enum class ActivationState {
    success,
    did_not_overwrite_existing,
    revoked,
    failed
}

data class CardActivationResultModel(
    val activationState: ActivationState,
    val totpSecret: String? = null,
    val activationTimeStamp: String = Instant.now().toString()
)
