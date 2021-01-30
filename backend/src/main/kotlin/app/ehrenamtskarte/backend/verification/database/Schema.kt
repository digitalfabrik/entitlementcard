package app.ehrenamtskarte.backend.verification.database

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import java.time.LocalDateTime
import java.time.ZoneOffset

const val HASH_LENGTH = 64 // Using SHA-512 for now
const val TOTP_SECRET_LENGTH = 20

@ExperimentalUnsignedTypes
object Cards : IntIdTable() {
    val totpSecret = binary("totpSecret", TOTP_SECRET_LENGTH)
    val expirationDate = ulong("expirationDate")
    val hashModel = binary("hashModel", HASH_LENGTH).uniqueIndex()
}

@ExperimentalUnsignedTypes
class CardEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<CardEntity>(Cards)

    var totpSecret by Cards.totpSecret
    private var expirationDateEpochSeconds by Cards.expirationDate
    var hashModel by Cards.hashModel

    var expirationDate: LocalDateTime
    get() =
        LocalDateTime.ofEpochSecond(expirationDateEpochSeconds.toLong(), 0, ZoneOffset.UTC)
    set(value) {
        expirationDateEpochSeconds = value.toEpochSecond(ZoneOffset.UTC).toULong()
    }
}
