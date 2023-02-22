package app.ehrenamtskarte.backend.application.webservice.schema.create

import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.Attachment
import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.ShortTextInput
import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable
import app.ehrenamtskarte.backend.application.webservice.utils.onlySelectedIsPresent
import com.expediagroup.graphql.generator.annotations.GraphQLDescription

enum class GoldenCardEntitlementType {
    // Ehrenamtliche, die seit mindestens 25 Jahren mindestens 5 Stunden pro Woche oder 250 Stunden pro Jahr
    // ehrenamtlich tätig waren.
    WORK_AT_ORGANIZATIONS,

    // Inhaber des Ehrenzeichens des Ministerpräsidenten,
    HONORED_BY_MINISTER_PRESIDENT,

    // Feuerwehrdienstleistende und Einsatzkräfte im Rettungsdienst und in sonstigen Einheiten des Katastrophenschutzes,
    // die eine Dienstzeitauszeichnung nach dem Feuerwehr- und Hilfsorganisationen-Ehrenzeichengesetz (FwHOEzG) haben,
    WORK_AT_DEPARTMENT,

    // Reservisten, die seit mindestens 25 Jahren regelmäßig aktiven Wehrdienst in der Bundeswehr leisten, indem sie in
    // dieser Zeit entweder insgesamt mindestens 500 Tage Reservisten-Dienstleistung erbracht haben oder in dieser Zeit
    // ständiger Angehöriger eines Bezirks- oder Kreisverbindungskommandos waren
    MILITARY_RESERVE,
}

data class GoldenCardWorkAtOrganizationsEntitlement(
    val list: List<WorkAtOrganization>,
) : JsonFieldSerializable {
    init {
        if (list.isEmpty()) {
            throw IllegalArgumentException("List may not be empty.")
        } else if (list.size > 5) {
            throw IllegalArgumentException("List may contain at most 5 entries.")
        }
    }

    override fun toJsonField() = JsonField(
        name = "goldenCardWorkAtOrganizationsEntitlement",
        type = Type.Array,
        translations = mapOf("de" to "Ich bin seit seit mindestens 25 Jahren mindestens 5 Stunden pro Woche oder 250 Stunden pro Jahr bei einem Verein oder einer Organisation ehrenamtlich tätig."),
        value = list.map { it.toJsonField() },
    )
}

data class GoldenCardHonoredByMinisterPresidentEntitlement(
    val certificate: Attachment,
) : JsonFieldSerializable {
    override fun toJsonField() = JsonField(
        name = "goldenCardHonoredByMinisterPresidentEntitlement",
        type = Type.Array,
        translations = mapOf("de" to "Ich bin Inhaber:in des Ehrenzeichens für Verdienstete im Ehrenamt des Bayerischen Ministerpräsidenten."),
        value = listOf(
            certificate.toJsonField("certificate", mapOf("de" to "Kopie der Urkunde")),
        ),
    )
}

data class GoldenCardWorkAtDepartmentEntitlement(
    val organization: Organization,
    val responsibility: ShortTextInput,
    val certificate: Attachment?,
) : JsonFieldSerializable {
    override fun toJsonField() = JsonField(
        name = "goldenCardWorkAtDepartmentEntitlement",
        type = Type.Array,
        translations = mapOf("de" to "Ich bin Feuerwehrdienstleistende:r oder Einsatzkraft im Rettungsdienst oder in Einheiten des Katastrophenschutzes und habe eine Dienstzeitauszeichnung nach dem Feuerwehr- und Hilfsorganisationen-Ehrenzeichengesetz (FwHOEzG) erhalten."),
        value = listOfNotNull(
            organization.toJsonField(),
            responsibility.toJsonField("responsibility", mapOf("de" to "Funktion")),
            certificate?.toJsonField("certificate", mapOf("de" to "Tätigkeitsnachweis")),
        ),
    )
}

data class GoldenCardMilitaryReserveEntitlement(
    val certificate: Attachment,
) : JsonFieldSerializable {
    override fun toJsonField() = JsonField(
        name = "goldenCardMilitaryReserveEntitlement",
        type = Type.Array,
        translations = mapOf("de" to "Ich leiste als Reservist:in seit mindestens 25 Jahren regelmäßig aktiven Wehrdienst in der Bundeswehr, indem ich in dieser Zeit entweder insgesamt mindestens 500 Tage Reservisten-Dienstleistung erbracht habe oder in dieser Zeit ständige:r Angehörige:r eines Bezirks- oder Kreisverbindungskommandos war."),
        value = listOf(
            certificate.toJsonField("certificate", mapOf("de" to "Tätigkeitsnachweis")),
        ),
    )
}

@GraphQLDescription(
    "Entitlement for a golden EAK. The field selected by entitlementType must not be null; all others must be null.",
)
data class GoldenCardEntitlement(
    val entitlementType: GoldenCardEntitlementType,
    val workAtOrganizationsEntitlement: GoldenCardWorkAtOrganizationsEntitlement?,
    val honoredByMinisterPresidentEntitlement: GoldenCardHonoredByMinisterPresidentEntitlement?,
    val workAtDepartmentEntitlement: GoldenCardWorkAtDepartmentEntitlement?,
    val militaryReserveEntitlement: GoldenCardMilitaryReserveEntitlement?,
) : JsonFieldSerializable {
    private val entitlementByEntitlementType = mapOf(
        GoldenCardEntitlementType.WORK_AT_ORGANIZATIONS to workAtOrganizationsEntitlement,
        GoldenCardEntitlementType.HONORED_BY_MINISTER_PRESIDENT to honoredByMinisterPresidentEntitlement,
        GoldenCardEntitlementType.WORK_AT_DEPARTMENT to workAtDepartmentEntitlement,
        GoldenCardEntitlementType.MILITARY_RESERVE to militaryReserveEntitlement,
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
