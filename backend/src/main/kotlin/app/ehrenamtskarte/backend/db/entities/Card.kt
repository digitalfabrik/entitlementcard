package app.ehrenamtskarte.backend.db.entities

import app.ehrenamtskarte.backend.userdata.database.UserEntitlements
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.javatime.CurrentTimestamp
import org.jetbrains.exposed.sql.javatime.timestamp
import org.jetbrains.exposed.sql.or

const val CARD_INFO_HASH_LENGTH = 32 // Using SHA256-HMAC
const val TOTP_SECRET_LENGTH = 20
const val ACTIVATION_SECRET_HASH_LENGTH = 70

enum class CodeType {
    STATIC,
    DYNAMIC,
}

object Cards : IntIdTable() {
    val activationSecretHash =
        binary("activationSecretHash", ACTIVATION_SECRET_HASH_LENGTH).nullable()
    val totpSecret = binary("totpSecret", TOTP_SECRET_LENGTH).nullable()

    // Days since 1970-01-01. For more information refer to the card.proto,
    // Using long because unsigned ints are not available, but we want to be able to represent them.
    // If this field is null, the card is valid forever.
    val expirationDay = long("expirationDay").nullable()
    val issueDate = timestamp("issueDate").defaultExpression(CurrentTimestamp)
    val revoked = bool("revoked")
    val regionId = reference("regionId", Regions)
    val issuerId = reference("issuerId", Administrators).nullable()
    val cardInfoHash = binary("cardInfoHash", CARD_INFO_HASH_LENGTH).uniqueIndex()
    val codeType = enumeration("codeType", CodeType::class)
    val firstActivationDate = timestamp("firstActivationDate").nullable()
    val entitlementId = reference("entitlementId", UserEntitlements).nullable()

    // startDay describes the first day on which the card is valid.
    // If this field is null, the card is valid until `expirationDay` without explicitly stating when the validity
    // period started.
    // Days since 1970-01-01. For more information refer to the card.proto,
    val startDay = long("startDay").nullable()

    init {
        check("CodeTypeConstraint") {
            (
                (activationSecretHash eq null) and
                    (totpSecret eq null) and
                    (codeType eq CodeType.STATIC)
            ) or
                ((activationSecretHash neq null) and (codeType eq CodeType.DYNAMIC))
        }
        check("issuerid_or_entitlementid_not_null") {
            (
                ((issuerId neq null) and (entitlementId eq null))
                    or ((issuerId eq null) and (entitlementId neq null))
            )
        }
    }
}

class CardEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<CardEntity>(Cards)

    var activationSecretHash by Cards.activationSecretHash
    var totpSecret by Cards.totpSecret
    var expirationDay by Cards.expirationDay
    var issueDate by Cards.issueDate
    var revoked by Cards.revoked
    var cardInfoHash by Cards.cardInfoHash
    var regionId by Cards.regionId
    var issuerId by Cards.issuerId
    var codeType by Cards.codeType
    var firstActivationDate by Cards.firstActivationDate
    var entitlementId by Cards.entitlementId
    var startDay by Cards.startDay
}
