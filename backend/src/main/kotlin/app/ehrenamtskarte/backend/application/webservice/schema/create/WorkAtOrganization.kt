package app.ehrenamtskarte.backend.application.webservice.schema.create

import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.Attachment
import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.DateInput
import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.ShortTextInput
import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable

data class WorkAtOrganization(
    val organization: Organization,
    val amountOfWork: Double,
    val responsibility: ShortTextInput,
    val workSinceDate: DateInput,
    val payment: Boolean,
    val certificate: Attachment
) : JsonFieldSerializable {
    override fun toJsonField(): JsonField {
        return JsonField(
            "workAtOrganization",
            mapOf("de" to "Arbeit bei Organisation oder Verein"),
            Type.Array,
            listOfNotNull(
                organization.toJsonField(),
                responsibility.toJsonField("responsibility", mapOf("de" to "Tätigkeit")),
                JsonField("amountOfWork", mapOf("de" to "Arbeitsaufwand (Stunden/Woche)"), Type.Number, amountOfWork),
                workSinceDate.toJsonField("workSinceDate", mapOf("de" to "Tätig seit")),
                JsonField(
                    "payment",
                    mapOf("de" to "Für diese ehrenamtliche Tätigkeit wurde eine Aufwandsentschädigung gewährt:"),
                    Type.Boolean,
                    payment
                ),
                certificate.toJsonField("certificate", mapOf("de" to "Tätigkeitsnachweis"))
            )
        )
    }
}
