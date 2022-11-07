package app.ehrenamtskarte.backend.application.webservice.schema.create

import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.Attachment
import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.DateInput
import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.ShortTextInput
import app.ehrenamtskarte.backend.application.webservice.schema.view.AttachmentView
import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable
import app.ehrenamtskarte.backend.application.webservice.utils.onlySelectedIsPresent
import com.expediagroup.graphql.generator.annotations.GraphQLDescription

enum class BlueCardEntitlementType {
    JULEICA,
    SERVICE,
    WORK_AT_ORGANIZATIONS
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

data class BlueCardJuleicaEntitlement(
    val juleicaNumber: ShortTextInput,
    val juleicaExpirationDate: DateInput,
    val copyOfJuleica: Attachment
) : JsonFieldSerializable {
    override fun toJsonField() = JsonField(
        name = "juleicaEntitlement",
        type = Type.Array,
        translations = mapOf("de" to "Juleica-Inhaber:in"),
        value = listOf(
            juleicaNumber.toJsonField("juleicaNumber", mapOf("de" to "Kartennummer")),
            juleicaExpirationDate.toJsonField("juleicaExpiration", mapOf("de" to "Karte gültig bis")),
            copyOfJuleica.toJsonField("copyOfJuleica", mapOf("de" to "Scan der Karte"))
        )
    )
}

data class BlueCardWorkAtOrganizationsEntitlement(
    val list: List<WorkAtOrganization>
) : JsonFieldSerializable {
    init {
        if (list.isEmpty()) {
            throw IllegalArgumentException("List may not be empty.")
        } else if (list.size > 5) {
            throw IllegalArgumentException("List may contain at most 5 entries.")
        }
    }

    override fun toJsonField() = JsonField(
        name = "workAtOrganizationsEntitlement",
        type = Type.Array,
        translations = mapOf("de" to "Engagement bei Verein oder Organisation"),
        value = list.map { it.toJsonField() }
    )
}

@GraphQLDescription(
    "Entitlement for a blue EAK. The field selected by entitlementType must not be null; all others must be null."
)
data class BlueCardEntitlement(
    val entitlementType: BlueCardEntitlementType,
    val juleicaEntitlement: BlueCardJuleicaEntitlement?,
    val serviceEntitlement: BlueCardServiceEntitlement?,
    val workAtOrganizationsEntitlement: BlueCardWorkAtOrganizationsEntitlement?
) : JsonFieldSerializable {
    private val entitlementByEntitlementType = mapOf(
        BlueCardEntitlementType.WORK_AT_ORGANIZATIONS to workAtOrganizationsEntitlement,
        BlueCardEntitlementType.SERVICE to serviceEntitlement,
        BlueCardEntitlementType.JULEICA to juleicaEntitlement
    )

    init {
        if (!onlySelectedIsPresent(entitlementByEntitlementType, entitlementType)) {
            throw IllegalArgumentException("The specified entitlements do not match entitlementType.")
        }
    }

    override fun toJsonField(): JsonField {
        return entitlementByEntitlementType[entitlementType]!!.toJsonField()
    }
}
