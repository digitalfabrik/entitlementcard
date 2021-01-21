package app.ehrenamtskarte.backend.verification.database

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import java.time.LocalDateTime
import java.time.ZoneOffset

// TODO recheck these constants when we know the technologies we use
const val BCRYPT_HASH_LENGTH = 60
const val TOTP_SECRET_LENGTH = 5

@ExperimentalUnsignedTypes
object Card : IntIdTable() {
    val totpSecret = binary("totpSecret", TOTP_SECRET_LENGTH)
    val expirationDate = ulong("expirationDate")
    val hashModel = char("hashModel", BCRYPT_HASH_LENGTH)

    init {
        uniqueIndex(expirationDate, hashModel)
    }
}

@ExperimentalUnsignedTypes
class CardEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<CardEntity>(Card)

    var totpSecret by Card.totpSecret
    private var expirationDateEpochSeconds by Card.expirationDate
    var hashModel by Card.hashModel

    var expirationDate: LocalDateTime
    get() =
        LocalDateTime.ofEpochSecond(expirationDateEpochSeconds.toLong(), 0, ZoneOffset.UTC)
    set(value) {
        expirationDateEpochSeconds = value.toEpochSecond(ZoneOffset.UTC).toULong()
    }
}
