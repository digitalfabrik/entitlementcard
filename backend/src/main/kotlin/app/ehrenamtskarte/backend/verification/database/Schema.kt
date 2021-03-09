package app.ehrenamtskarte.backend.verification.database

import app.ehrenamtskarte.backend.regions.database.Regions
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import java.time.LocalDateTime
import java.time.ZoneOffset

const val CARD_DETAILS_HASH_LENGTH = 32 // Using SHA256-HMAC
const val TOTP_SECRET_LENGTH = 20

object Cards : IntIdTable() {
    val totpSecret = binary("totpSecret", TOTP_SECRET_LENGTH)
    val expirationDate = long("expirationDate") // Seconds since 1970
    val issueDate = long("issueDate")
    val revoked = bool("revoked")
    val regionId = reference("regionId", Regions)
    val cardDetailsHash = binary("cardDetailsHash", CARD_DETAILS_HASH_LENGTH).uniqueIndex()
}

class CardEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<CardEntity>(Cards)

    var totpSecret by Cards.totpSecret
    private var expirationDateEpochSeconds by Cards.expirationDate
    private var issueDateEpochSeconds by Cards.issueDate
    var revoked by Cards.revoked
    var cardDetailsHash by Cards.cardDetailsHash
    var regionId by Cards.regionId

    var expirationDate: LocalDateTime?
        get() = if (expirationDateEpochSeconds > 0) LocalDateTime.ofEpochSecond(
            expirationDateEpochSeconds,
            0,
            ZoneOffset.UTC
        ) else null
        set(value) {
            expirationDateEpochSeconds = value?.toEpochSecond(ZoneOffset.UTC) ?: 0
        }

    var issueDate: LocalDateTime
        get() = LocalDateTime.ofEpochSecond(expirationDateEpochSeconds, 0, ZoneOffset.UTC)
        set(value) {
            issueDateEpochSeconds = value.toEpochSecond(ZoneOffset.UTC)
        }
}
