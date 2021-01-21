package app.ehrenamtskarte.backend.verification.webservice

import app.ehrenamtskarte.backend.verification.database.repos.CardRepository
import app.ehrenamtskarte.backend.verification.domain.Card
import app.ehrenamtskarte.backend.verification.service.CardVerifier
import io.javalin.http.BadRequestResponse
import io.javalin.http.Context
import io.javalin.http.NotFoundResponse
import org.jetbrains.exposed.sql.transactions.transaction
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
        val bodyParts = ctx.body().split(".")
        if (bodyParts.size != 2)
            throw BadRequestResponse("Body did not exactly contain verification model and totp code separated by comma.")
        val code = try {
            bodyParts[1].toInt()
        } catch (nfe: NumberFormatException) {
            throw BadRequestResponse("TOTP was not an integer.")
        }
        val verified = CardVerifier.verifyCardHash(bodyParts[0], code)
        if (!verified)
            throw NotFoundResponse("No unexpired card matching that TOTP found")
        ctx.result("OK")
    }
}
