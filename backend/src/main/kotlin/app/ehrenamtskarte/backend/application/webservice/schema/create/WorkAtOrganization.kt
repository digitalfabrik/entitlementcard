package app.ehrenamtskarte.backend.application.webservice.schema.create

import app.ehrenamtskarte.backend.application.webservice.schema.view.AttachmentView
import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable

enum class AmountOfWorkUnit {
    HOURS_PER_WEEK,
    HOURS_PER_YEAR
}

data class WorkAtOrganization(
    val organization: Organization,
    val amountOfWork: Double,
    val amountOfWorkUnit: AmountOfWorkUnit,
    val certificate: Attachment
) : JsonFieldSerializable {
    override fun toJsonField(): JsonField {
        return JsonField(
            "workAtOrganization", mapOf("de" to "Arbeit bei Organisation oder Verein"), Type.Array,
            listOf(
                organization.toJsonField(),
                JsonField("amountOfWork", mapOf("de" to "Arbeitsaufwand"), Type.Number, amountOfWork),
                JsonField(
                    "amountOfWorkUnit", mapOf("de" to "Aufwandseinheit"), Type.String, when (amountOfWorkUnit) {
                        AmountOfWorkUnit.HOURS_PER_WEEK -> "Stunden pro Woche"
                        AmountOfWorkUnit.HOURS_PER_YEAR -> "Stunden pro Jahr"
                    }
                ),
                JsonField("certificate", mapOf("de" to "Zertifikat"), Type.Attachment, AttachmentView.from(certificate))
            )
        )
    }
}
