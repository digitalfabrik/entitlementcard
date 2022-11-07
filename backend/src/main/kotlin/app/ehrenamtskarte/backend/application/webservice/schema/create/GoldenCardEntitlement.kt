package app.ehrenamtskarte.backend.application.webservice.schema.create

import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.Attachment
import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable
import app.ehrenamtskarte.backend.application.webservice.utils.onlySelectedIsPresent
import com.expediagroup.graphql.generator.annotations.GraphQLDescription

enum class GoldenCardEntitlementType {
    SERVICE_AWARD,
    HONORED_BY_MINISTER_PRESIDENT,
    WORK_AT_ORGANIZATIONS
}

data class GoldenCardWorkAtOrganizationsEntitlement(
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
        translations = mapOf("de" to "Ehrenamtliches Engagement bei Verein oder Organisation"),
        value = list.map { it.toJsonField() }
    )
}

data class GoldenCardHonoredByMinisterPresidentEntitlement(
    val certificate: Attachment
) : JsonFieldSerializable {
    override fun toJsonField() = JsonField(
        name = "honorByMinisterPresidentEntitlement",
        type = Type.Array,
        translations = mapOf("de" to "Inhaber:in des Ehrenzeichens für Verdienstete im Ehrenamt des Bayerischen Ministerpräsidenten"),
        value = listOf(
            certificate.toJsonField("certificate", mapOf("de" to "Zertifikat"))
        )
    )
}

data class GoldenCardServiceEntitlement(
    val certificate: Attachment
) : JsonFieldSerializable {
    override fun toJsonField() = JsonField(
        name = "honorByMinisterPresidentEntitlement",
        type = Type.Array,
        translations = mapOf("de" to "Inhaber:in einer Dienstauszeichnung des Freistaats Bayern nach Feuer- und Hilfsorganisationengesetz"),
        value = listOf(
            certificate.toJsonField("certificate", mapOf("de" to "Zertifikat"))
        )
    )
}

@GraphQLDescription(
    "Entitlement for a golden EAK. The field selected by entitlementType must not be null; all others must be null."
)
data class GoldenCardEntitlement(
    val entitlementType: GoldenCardEntitlementType,
    val honoredByMinisterPresidentEntitlement: GoldenCardHonoredByMinisterPresidentEntitlement?,
    val serviceEntitlement: GoldenCardServiceEntitlement?,
    val workAtOrganizationsEntitlement: GoldenCardWorkAtOrganizationsEntitlement?
) : JsonFieldSerializable {
    private val entitlementByEntitlementType = mapOf(
        GoldenCardEntitlementType.HONORED_BY_MINISTER_PRESIDENT to honoredByMinisterPresidentEntitlement,
        GoldenCardEntitlementType.WORK_AT_ORGANIZATIONS to workAtOrganizationsEntitlement,
        GoldenCardEntitlementType.SERVICE_AWARD to serviceEntitlement
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
