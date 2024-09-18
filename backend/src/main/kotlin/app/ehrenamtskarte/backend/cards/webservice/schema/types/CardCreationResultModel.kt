package app.ehrenamtskarte.backend.cards.webservice.schema.types

import app.ehrenamtskarte.backend.regions.webservice.schema.types.Region

data class DynamicActivationCodeResult(
    val cardInfoHashBase64: String,
    val codeBase64: String
)

data class StaticVerificationCodeResult(
    val cardInfoHashBase64: String,
    val codeBase64: String
)

data class CardCreationResultModel(
    val dynamicActivationCode: DynamicActivationCodeResult,
    val staticVerificationCode: StaticVerificationCodeResult?
)

data class CardCreationSelfServiceResultModel(
    val dynamicActivationCode: DynamicActivationCodeResult,
    val staticVerificationCode: StaticVerificationCodeResult?,
    val region: Region
)
