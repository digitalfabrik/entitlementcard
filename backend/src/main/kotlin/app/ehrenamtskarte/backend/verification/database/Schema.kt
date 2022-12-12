package app.ehrenamtskarte.backend.verification.database

import app.ehrenamtskarte.backend.regions.database.Regions
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.javatime.CurrentDateTime
import org.jetbrains.exposed.sql.javatime.datetime
import java.time.LocalDateTime

const val CARD_DETAILS_HASH_LENGTH = 32 // Using SHA256-HMAC
const val TOTP_SECRET_LENGTH = 20

object Cards : IntIdTable() {
    val totpSecret = binary("totpSecret", TOTP_SECRET_LENGTH)
    // Using long because unsigned ints are not available, but we want to be able to represent them.
    // The integer type has a max value of
    // Days since 1970
    val expirationDay = long("expirationDay").nullable()
    val issueDate = datetime("issueDate").defaultExpression(CurrentDateTime)
    val revoked = bool("revoked")
    val regionId = reference("regionId", Regions)
    val cardDetailsHash = binary("cardDetailsHash", CARD_DETAILS_HASH_LENGTH).uniqueIndex()
}

class CardEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<CardEntity>(Cards)

    var totpSecret by Cards.totpSecret
    private var expirationDay by Cards.expirationDay
    private var issueDateEpochSeconds by Cards.issueDate
    var revoked by Cards.revoked
    var cardDetailsHash by Cards.cardDetailsHash
    var regionId by Cards.regionId

    var expirationDate: Long?
        get() = expirationDay
        set(value) {
            expirationDay = value
        }

    var issueDate: LocalDateTime
        get() = issueDateEpochSeconds
        set(value) {
            issueDateEpochSeconds = value
        }
}
