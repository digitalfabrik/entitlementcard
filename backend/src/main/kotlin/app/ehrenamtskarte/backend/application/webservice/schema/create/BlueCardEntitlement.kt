package app.ehrenamtskarte.backend.application.webservice.schema.create

import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.Attachment
import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.DateInput
import app.ehrenamtskarte.backend.application.webservice.schema.create.primitives.ShortTextInput
import app.ehrenamtskarte.backend.application.webservice.schema.view.JsonField
import app.ehrenamtskarte.backend.application.webservice.schema.view.Type
import app.ehrenamtskarte.backend.application.webservice.utils.ApplicationVerificationsHolder
import app.ehrenamtskarte.backend.application.webservice.utils.JsonFieldSerializable
import app.ehrenamtskarte.backend.application.webservice.utils.onlySelectedIsPresent
import com.expediagroup.graphql.generator.annotations.GraphQLDescription

enum class BlueCardEntitlementType {
    // mindestens zwei Jahren freiwillig durchschnittlich fünf Stunden pro Woche oder bei Projektarbeiten mindestens
    // 250 Stunden jährlich engagieren
    WORK_AT_ORGANIZATIONS,

    // Inhaber einer Juleica (Jugendleitercard) sind
    JULEICA,

    // Ich bin aktiv in der Freiwilligen Feuerwehr mit abgeschlossener Truppmannausbildung bzw. abgeschlossenem
    // Basis-Modul der Modularen Truppausbildung (MTA), oder im Katastrophenschutz oder im Rettungsdienst mit
    // abgeschlossener Grundausbildung.
    WORK_AT_DEPARTMENT,

    // als Reservist regelmäßig aktiven Wehrdienst in der Bundeswehr leisten, indem sie entweder in den vergangenen zwei
    // Kalenderjahren insgesamt mindestens 40 Tage Reservisten-Dienstleistung erbracht haben oder in den vergangenen
    // zwei Kalenderjahren ständiger Angehöriger eines Bezirks- oder Kreisverbindungskommandos waren
    MILITARY_RESERVE,

    // einen Freiwilligendienst ableisten in einem Freiwilligen Sozialen Jahr (FSJ), einem Freiwilligen ökologischem
    // Jahr (FÖJ) oder einem Bundesfreiwilligendienst (BFD).
    VOLUNTEER_SERVICE
}

data class BlueCardWorkAtOrganizationsEntitlement(
    val list: List<WorkAtOrganization>
) : JsonFieldSerializable, ApplicationVerificationsHolder {
    init {
        if (list.isEmpty()) {
            throw IllegalArgumentException("List may not be empty.")
        } else if (list.size > 5) {
            throw IllegalArgumentException("List may contain at most 5 entries.")
        }
    }

    override fun toJsonField() = JsonField(
        name = "blueCardWorkAtOrganizationsEntitlement",
        type = Type.Array,
        translations = mapOf("de" to "Ich engagiere mich ehrenamtlich seit mindestens zwei Jahren freiwillig mindestens fünf Stunden pro Woche oder bei Projektarbeiten mindestens 250 Stunden jährlich"),
        value = list.map { it.toJsonField() }
    )

    override fun extractApplicationVerifications() =
        list.map { it.organization.extractApplicationVerifications() }.flatten()
}

data class BlueCardJuleicaEntitlement(
    val juleicaNumber: ShortTextInput,
    val juleicaExpirationDate: DateInput,
    val copyOfJuleica: Attachment
) : JsonFieldSerializable {
    override fun toJsonField() = JsonField(
        name = "blueCardJuleicaEntitlement",
        type = Type.Array,
        translations = mapOf("de" to "Ich bin Inhaber:in einer JuLeiCa (Jugendleiter:in-Card)"),
        value = listOf(
            juleicaNumber.toJsonField("juleicaNumber", mapOf("de" to "Kartennummer")),
            juleicaExpirationDate.toJsonField("juleicaExpiration", mapOf("de" to "Karte gültig bis")),
            copyOfJuleica.toJsonField("copyOfJuleica", mapOf("de" to "Kopie der Karte"))
        )
    )
}

data class BlueCardWorkAtDepartmentEntitlement(
    val organization: Organization,
    val responsibility: ShortTextInput,
    val certificate: Attachment?
) : JsonFieldSerializable, ApplicationVerificationsHolder {
    override fun toJsonField(): JsonField {
        return JsonField(
            name = "blueCardWorkAtDepartmentEntitlement",
            type = Type.Array,
            translations = mapOf("de" to "Ich bin aktiv in der Freiwilligen Feuerwehr mit abgeschlossener Truppmannausbildung bzw. abgeschlossenem Basis-Modul der Modularen Truppausbildung (MTA), oder im Katastrophenschutz oder im Rettungsdienst mit abgeschlossener Grundausbildung."),
            value = listOfNotNull(
                organization.toJsonField(),
                responsibility.toJsonField("responsibility", mapOf("de" to "Funktion")),
                certificate?.toJsonField("certificate", mapOf("de" to "Tätigkeitsnachweis"))
            )
        )
    }

    override fun extractApplicationVerifications() = organization.extractApplicationVerifications()
}

data class BlueCardMilitaryReserveEntitlement(
    val certificate: Attachment
) : JsonFieldSerializable {
    override fun toJsonField(): JsonField {
        return JsonField(
            name = "blueCardMilitaryReserveEntitlement",
            type = Type.Array,
            translations = mapOf("de" to "Ich habe in den vergangenen zwei Kalenderjahren als Reservist regelmäßig aktiven Wehrdienst in der Bundeswehr geleistet, indem ich insgesamt mindestens 40 Tage Reservisten-Dienstleistung erbracht habe oder ständige:r Angehörige:r eines Bezirks- oder Kreisverbindungskommandos war."),
            value = listOfNotNull(
                certificate.toJsonField("certificate", mapOf("de" to "Tätigkeitsnachweis"))
            )
        )
    }
}

data class BlueCardVolunteerServiceEntitlement(
    val programName: ShortTextInput,
    val certificate: Attachment
) : JsonFieldSerializable {
    override fun toJsonField(): JsonField {
        return JsonField(
            name = "volunteerServiceEntitlement",
            type = Type.Array,
            translations = mapOf("de" to "Ich leiste einen Freiwilligendienst ab in einem Freiwilligen Sozialen Jahr (FSJ), einem Freiwilligen Ökologischen Jahr (FÖJ) oder einem Bundesfreiwilligendienst (BFD)."),
            value = listOfNotNull(
                programName.toJsonField("programName", mapOf("de" to "Name des Programms")),
                certificate.toJsonField("certificate", mapOf("de" to "Tätigkeitsnachweis"))
            )
        )
    }
}

@GraphQLDescription(
    "Entitlement for a blue EAK. The field selected by entitlementType must not be null; all others must be null."
)
data class BlueCardEntitlement(
    val entitlementType: BlueCardEntitlementType,
    val workAtOrganizationsEntitlement: BlueCardWorkAtOrganizationsEntitlement?,
    val juleicaEntitlement: BlueCardJuleicaEntitlement?,
    val workAtDepartmentEntitlement: BlueCardWorkAtDepartmentEntitlement?,
    val militaryReserveEntitlement: BlueCardMilitaryReserveEntitlement?,
    val volunteerServiceEntitlement: BlueCardVolunteerServiceEntitlement?
) : JsonFieldSerializable, ApplicationVerificationsHolder {
    private val entitlementByEntitlementType = mapOf(
        BlueCardEntitlementType.WORK_AT_ORGANIZATIONS to workAtOrganizationsEntitlement,
        BlueCardEntitlementType.JULEICA to juleicaEntitlement,
        BlueCardEntitlementType.WORK_AT_DEPARTMENT to workAtDepartmentEntitlement,
        BlueCardEntitlementType.MILITARY_RESERVE to militaryReserveEntitlement,
        BlueCardEntitlementType.VOLUNTEER_SERVICE to volunteerServiceEntitlement
    )

    init {
        if (!onlySelectedIsPresent(entitlementByEntitlementType, entitlementType)) {
            throw IllegalArgumentException("The specified entitlements do not match entitlementType.")
        }
    }

    override fun toJsonField(): JsonField {
        return entitlementByEntitlementType[entitlementType]!!.toJsonField()
    }

    override fun extractApplicationVerifications() = listOfNotNull(
        workAtOrganizationsEntitlement?.extractApplicationVerifications(),
        workAtDepartmentEntitlement?.extractApplicationVerifications()
    ).flatten()
}
