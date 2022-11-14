package app.ehrenamtskarte.backend.application.webservice.schema.create

import app.ehrenamtskarte.backend.application.webservice.schema.view.AttachmentView
import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable
import com.expediagroup.graphql.generator.annotations.GraphQLDescription

enum class BlueCardEntitlementType {
    JULEICA,
    SERVICE,
    STANDARD
}

data class BlueCardServiceEntitlement(
    val organization: Organization,
    val responsibility: String?,
    val certificate: Attachment?
) : JsonFieldSerializable {
    override fun toJsonField(): JsonField {
        return JsonField(
            name = "serviceEntitlement",
            type = Type.Array,
            translations = mapOf("de" to "Spezieller Dienst mit Grundausbildung"),
            value = listOfNotNull(
                organization.toJsonField(),
                if (responsibility != null) {
                    JsonField("responsibility", mapOf("de" to "Funktion"), Type.String, responsibility)
                } else null,
                if (certificate != null) JsonField(
                    "serviceCertificate",
                    mapOf("de" to "Zertifikat"),
                    Type.Attachment,
                    AttachmentView.from(certificate)
                ) else null
            )
        )
    }
}

@GraphQLDescription(
    """Entitlement for blue EAK.
    Either entitlementType == Juleica and juleicaNumber, juleicaExpirationDate, copyOfJuleica are not null
    or     entitlementType == Service and serviceActivity, serviceCertification are not null
    or     entitlementType == Standard and workAtOrganizations is not null
"""
)
data class BlueCardEntitlement(
    val entitlementType: BlueCardEntitlementType,
    val juleicaNumber: String?,
    val juleicaExpirationDate: String?,
    val copyOfJuleica: Attachment?,
    val serviceEntitlement: BlueCardServiceEntitlement?,
    val workAtOrganizations: List<WorkAtOrganization>?
) : JsonFieldSerializable {
    override fun toJsonField(): JsonField {
        return JsonField(
            name = "blueCardEntitlement",
            translations = mapOf("de" to "Berechtigungsgrund"),
            type = Type.Array,
            value = listOf(
                when (entitlementType) {
                    BlueCardEntitlementType.JULEICA -> JsonField(
                        name = "juleicaEntitlement",
                        type = Type.Array,
                        translations = mapOf("de" to "Juleica-Inhaber:in"),
                        value = listOf(
                            JsonField("juleicaNumber", mapOf("de" to "Kartennummer"), Type.String, juleicaNumber!!),
                            JsonField(
                                "juleicaExpiration",
                                mapOf("de" to "Karte gültig bis"),
                                Type.String,
                                juleicaExpirationDate!!
                            ),
                            JsonField(
                                "copyOfJuleica",
                                mapOf("de" to "Scan der Karte"),
                                Type.Attachment,
                                AttachmentView.from(copyOfJuleica!!)
                            )
                        )
                    )

                    BlueCardEntitlementType.SERVICE -> serviceEntitlement!!.toJsonField()
                    BlueCardEntitlementType.STANDARD -> JsonField(
                        name = "standardEntitlement",
                        type = Type.Array,
                        translations = mapOf("de" to "Engagement bei Verein oder Organisation"),
                        value = workAtOrganizations!!.map { it.toJsonField() }
                    )
                }
            )
        )
    }
}
