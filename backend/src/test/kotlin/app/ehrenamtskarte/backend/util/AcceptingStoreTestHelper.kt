package app.ehrenamtskarte.backend.util

import app.ehrenamtskarte.backend.generated.inputs.AcceptingStoreInput
import app.ehrenamtskarte.backend.helper.CSVAcceptanceStoreBuilder

class AcceptingStoreTestHelper {
    data class AcceptingStoreValidationErrorTestCase(
        val csvStore: AcceptingStoreInput,
        val error: String,
    )

    companion object {
        @JvmStatic
        fun validationErrorTestCases(): List<AcceptingStoreValidationErrorTestCase> {
            val blankValues = listOf("", " ")
            val builders: Map<String, (String) -> AcceptingStoreInput> = mapOf(
                "name" to { value -> CSVAcceptanceStoreBuilder.build(name = value) },
                "location" to { value -> CSVAcceptanceStoreBuilder.build(location = value) },
                "street" to { value -> CSVAcceptanceStoreBuilder.build(street = value) },
                "houseNumber" to { value -> CSVAcceptanceStoreBuilder.build(houseNumber = value) },
                "postalCode" to { value -> CSVAcceptanceStoreBuilder.build(postalCode = value) },
            )
            return builders.flatMap { (fieldName, builder) ->
                blankValues.map { value ->
                    AcceptingStoreValidationErrorTestCase(
                        csvStore = builder(value),
                        error = "Empty string passed for required property: $fieldName",
                    )
                }
            }
        }
    }
}
