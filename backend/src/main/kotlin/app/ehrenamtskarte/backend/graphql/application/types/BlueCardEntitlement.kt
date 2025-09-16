package app.ehrenamtskarte.backend.graphql.application.types

import app.ehrenamtskarte.backend.graphql.application.types.primitives.Attachment
import app.ehrenamtskarte.backend.graphql.application.types.primitives.DateInput
import app.ehrenamtskarte.backend.graphql.application.types.primitives.ShortTextInput
import app.ehrenamtskarte.backend.graphql.application.utils.onlySelectedIsPresent
import app.ehrenamtskarte.backend.graphql.shared.exceptions.InvalidJsonException
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
    VOLUNTEER_SERVICE,
}

data class BlueCardWorkAtOrganizationsEntitlement(
    val list: List<WorkAtOrganization>,
) : JsonFieldSerializable, ApplicationVerificationsHolder {
    init {
        if (list.isEmpty()) {
            throw InvalidJsonException("List may not be empty.")
        } else if (list.size > 5) {
            throw InvalidJsonException("List may contain at most 5 entries.")
        }
    }

    override fun toJsonField() =
        JsonField(
            name = "blueCardWorkAtOrganizationsEntitlement",
            type = Type.Array,
            value = list.map { it.toJsonField() },
        )

    override fun extractApplicationVerifications() =
        list.map { it.organization.extractApplicationVerifications() }.flatten()
}

data class BlueCardJuleicaEntitlement(
    val juleicaNumber: ShortTextInput,
    val juleicaExpirationDate: DateInput,
    val copyOfJuleicaFront: Attachment,
    val copyOfJuleicaBack: Attachment?,
) : JsonFieldSerializable {
    override fun toJsonField() =
        JsonField(
            name = "blueCardJuleicaEntitlement",
            type = Type.Array,
            value = listOfNotNull(
                juleicaNumber.toJsonField("juleicaNumber"),
                juleicaExpirationDate.toJsonField("juleicaExpiration"),
                copyOfJuleicaFront.toJsonField("copyOfJuleicaFront"),
                copyOfJuleicaBack?.toJsonField("copyOfJuleicaBack"),
            ),
        )
}

data class BlueCardWorkAtDepartmentEntitlement(
    val organization: Organization,
    val responsibility: ShortTextInput,
    val certificate: Attachment?,
) : JsonFieldSerializable, ApplicationVerificationsHolder {
    override fun toJsonField(): JsonField =
        JsonField(
            name = "blueCardWorkAtDepartmentEntitlement",
            type = Type.Array,
            value = listOfNotNull(
                organization.toJsonField(),
                responsibility.toJsonField("responsibility"),
                certificate?.toJsonField("certificate"),
            ),
        )

    override fun extractApplicationVerifications() = organization.extractApplicationVerifications()
}

data class BlueCardMilitaryReserveEntitlement(
    val certificate: Attachment,
) : JsonFieldSerializable {
    override fun toJsonField(): JsonField =
        JsonField(
            name = "blueCardMilitaryReserveEntitlement",
            type = Type.Array,
            value = listOfNotNull(
                certificate.toJsonField("certificate"),
            ),
        )
}

data class BlueCardVolunteerServiceEntitlement(
    val programName: ShortTextInput,
    val certificate: Attachment,
) : JsonFieldSerializable {
    override fun toJsonField(): JsonField =
        JsonField(
            name = "volunteerServiceEntitlement",
            type = Type.Array,
            value = listOfNotNull(
                programName.toJsonField("programName"),
                certificate.toJsonField("certificate"),
            ),
        )
}

@GraphQLDescription(
    "Entitlement for a blue EAK. The field selected by entitlementType must not be null; all others must be null.",
)
data class BlueCardEntitlement(
    val entitlementType: BlueCardEntitlementType,
    val workAtOrganizationsEntitlement: BlueCardWorkAtOrganizationsEntitlement?,
    val juleicaEntitlement: BlueCardJuleicaEntitlement?,
    val workAtDepartmentEntitlement: BlueCardWorkAtDepartmentEntitlement?,
    val militaryReserveEntitlement: BlueCardMilitaryReserveEntitlement?,
    val volunteerServiceEntitlement: BlueCardVolunteerServiceEntitlement?,
) : JsonFieldSerializable, ApplicationVerificationsHolder {
    private val entitlementByEntitlementType = mapOf(
        BlueCardEntitlementType.WORK_AT_ORGANIZATIONS to workAtOrganizationsEntitlement,
        BlueCardEntitlementType.JULEICA to juleicaEntitlement,
        BlueCardEntitlementType.WORK_AT_DEPARTMENT to workAtDepartmentEntitlement,
        BlueCardEntitlementType.MILITARY_RESERVE to militaryReserveEntitlement,
        BlueCardEntitlementType.VOLUNTEER_SERVICE to volunteerServiceEntitlement,
    )

    init {
        if (!onlySelectedIsPresent(entitlementByEntitlementType, entitlementType)) {
            throw InvalidJsonException("The specified entitlements do not match entitlementType.")
        }
    }

    override fun toJsonField(): JsonField = entitlementByEntitlementType[entitlementType]!!.toJsonField()

    override fun extractApplicationVerifications() =
        listOfNotNull(
            workAtOrganizationsEntitlement?.extractApplicationVerifications(),
            workAtDepartmentEntitlement?.extractApplicationVerifications(),
        ).flatten()
}
