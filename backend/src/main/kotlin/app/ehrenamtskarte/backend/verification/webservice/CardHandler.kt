package app.ehrenamtskarte.backend.verification.webservice

import io.javalin.http.Context
import org.jetbrains.exposed.sql.transactions.transaction
import app.ehrenamtskarte.backend.verification.database.repos.CardRepository
import app.ehrenamtskarte.backend.verification.domain.Card
import java.time.LocalDateTime
import java.time.ZoneOffset

data class CardTo @ExperimentalUnsignedTypes constructor(var totpSecret: ByteArray = ByteArray(0), var expirationDate: ULong = 0UL, var hashModel: String = "")

class CardHandler {
    @ExperimentalUnsignedTypes
    fun addCard(ctx: Context) {
        val cardTo = ctx.body<CardTo>()
        transaction {
            CardRepository.insert(
                Card(
                    cardTo.totpSecret,
                    LocalDateTime.ofEpochSecond(cardTo.expirationDate.toLong(), 0, ZoneOffset.UTC),
                    cardTo.hashModel
                )
            )
        }
    }

    fun verifyCard(ctx: Context) {
        throw NotImplementedError("Card verification not yet implemented")
    }
}
