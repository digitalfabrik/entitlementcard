package app.ehrenamtskarte.backend.verification.webservice.schema.types

import java.time.Instant

@Suppress("ktlint:enum-entry-name-case")
enum class ActivationState {
    success,
    did_not_overwrite_existing,
    failed
}

data class CardActivationResultModel(
    val activationState: ActivationState,
    val totpSecret: String? = null,
    val activationTimeStamp: String = Instant.now().toString()
)
