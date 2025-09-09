package app.ehrenamtskarte.backend.graphql.application.schema.create

import app.ehrenamtskarte.backend.graphql.application.schema.create.primitives.Attachment
import app.ehrenamtskarte.backend.graphql.application.schema.create.primitives.ShortTextInput
import app.ehrenamtskarte.backend.graphql.application.schema.view.JsonField
import app.ehrenamtskarte.backend.graphql.application.schema.view.Type
import app.ehrenamtskarte.backend.graphql.application.utils.ApplicationVerificationsHolder
import app.ehrenamtskarte.backend.graphql.application.utils.JsonFieldSerializable
import app.ehrenamtskarte.backend.graphql.application.utils.onlySelectedIsPresent
import app.ehrenamtskarte.backend.graphql.shared.exceptions.InvalidJsonException
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
            name = "goldenCardWorkAtOrganizationsEntitlement",
            type = Type.Array,
            value = list.map { it.toJsonField() },
        )

    override fun extractApplicationVerifications() =
        list.map { it.organization.extractApplicationVerifications() }.flatten()
}

data class GoldenCardHonoredByMinisterPresidentEntitlement(
    val certificate: Attachment,
) : JsonFieldSerializable {
    override fun toJsonField() =
        JsonField(
            name = "goldenCardHonoredByMinisterPresidentEntitlement",
            type = Type.Array,
            value = listOf(certificate.toJsonField("certificate")),
        )
}

data class GoldenCardWorkAtDepartmentEntitlement(
    val organization: Organization,
    val responsibility: ShortTextInput,
    val certificate: Attachment?,
) : JsonFieldSerializable, ApplicationVerificationsHolder {
    override fun toJsonField() =
        JsonField(
            name = "goldenCardWorkAtDepartmentEntitlement",
            type = Type.Array,
            value = listOfNotNull(
                organization.toJsonField(),
                responsibility.toJsonField("responsibility"),
                certificate?.toJsonField("certificate"),
            ),
        )

    override fun extractApplicationVerifications() = organization.extractApplicationVerifications()
}

data class GoldenCardMilitaryReserveEntitlement(
    val certificate: Attachment,
) : JsonFieldSerializable {
    override fun toJsonField() =
        JsonField(
            name = "goldenCardMilitaryReserveEntitlement",
            type = Type.Array,
            value = listOf(
                certificate.toJsonField("certificate"),
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
) : JsonFieldSerializable, ApplicationVerificationsHolder {
    private val entitlementByEntitlementType = mapOf(
        GoldenCardEntitlementType.WORK_AT_ORGANIZATIONS to workAtOrganizationsEntitlement,
        GoldenCardEntitlementType.HONORED_BY_MINISTER_PRESIDENT to honoredByMinisterPresidentEntitlement,
        GoldenCardEntitlementType.WORK_AT_DEPARTMENT to workAtDepartmentEntitlement,
        GoldenCardEntitlementType.MILITARY_RESERVE to militaryReserveEntitlement,
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
