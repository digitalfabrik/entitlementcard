package app.ehrenamtskarte.backend.verification.webservice.schema.types

enum class ActivationState {
    success,
    did_not_overwrite_existing,
    failed
}

data class CardActivationResultModel(
    val activationState: ActivationState,
    val totpSecret: String? = null
)
