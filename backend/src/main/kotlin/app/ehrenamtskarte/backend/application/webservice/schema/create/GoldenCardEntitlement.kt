package app.ehrenamtskarte.backend.application.webservice.schema.create

import app.ehrenamtskarte.backend.application.webservice.schema.view.AttachmentView
import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable


enum class GoldenCardEntitlementType {
    SERVICE_AWARD,
    STANDARD,
    HONOR_BY_MINISTER_PRESIDENT
}

data class GoldenCardEntitlement(
    val goldenEntitlementType: GoldenCardEntitlementType,
    val certificate: Attachment?,
    val workAtOrganizations: List<WorkAtOrganization>?
) : JsonFieldSerializable {
    override fun toJsonField(): JsonField {
        return JsonField(
            "entitlement", mapOf("de" to "Berechtigungsgrund"), Type.Array, listOf(
                when (goldenEntitlementType) {
                    GoldenCardEntitlementType.HONOR_BY_MINISTER_PRESIDENT -> JsonField(
                        "honorByMinisterPresidentEntitlement",
                        mapOf(
                            "de" to "Inhaber:in des Ehrenzeichens für Verdienstet im Ehrenamt"
                                    + " des Bayerischen Ministerpräsidenten"
                        ),
                        Type.Attachment,
                        listOf(
                            JsonField(
                                "certificate",
                                mapOf("de" to "Zertifikat"),
                                Type.String,
                                AttachmentView.from(certificate!!)
                            )
                        )
                    )
                    GoldenCardEntitlementType.SERVICE_AWARD -> JsonField(
                        "serviceAwardEntitlement",
                        mapOf(
                            "de" to "Inhaber:in einer Dienstauszeichnung des Freistaats Bayern nach Feuer- und"
                                    + " Hilfsorganisationengesetz"
                        ),
                        Type.Attachment,
                        listOf(
                            JsonField(
                                "certificate",
                                mapOf("de" to "Zertifikat"),
                                Type.String,
                                AttachmentView.from(certificate!!)
                            )
                        )
                    )
                    GoldenCardEntitlementType.STANDARD -> JsonField(
                        "standardEntitlement",
                        mapOf("de" to "Ehrenamtliches Engagement bei Verein oder Organisation"),
                        Type.Array,
                        workAtOrganizations!!.map { it.toJsonField() }
                    )
                }
            )
        )
    }
}
