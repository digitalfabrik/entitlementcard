package xyz.elitese.ehrenamtskarte.administration.webservice

import io.javalin.http.BadRequestResponse
import io.javalin.http.Context
import io.javalin.http.InternalServerErrorResponse
import io.javalin.plugin.openapi.dsl.OpenApiDocumentation
import io.javalin.plugin.openapi.dsl.document
import xyz.elitese.ehrenamtskarte.administration.card.CardDetails
import xyz.elitese.ehrenamtskarte.administration.card.CardIssueException
import xyz.elitese.ehrenamtskarte.administration.card.CardIssuer
import java.time.LocalDate
import java.time.format.DateTimeFormatter

class CardIssueHandler {
    private val cardIssuer = CardIssuer()

    fun handleCardIssueRequest(ctx: Context) {
        val cardDetails = try {
            parseCardDetails(ctx.queryParamMap())
        } catch (e: IllegalArgumentException) {
            throw BadRequestResponse(e.message ?: "Could not parse card details")
        }

        val qrCode = try{
            cardIssuer.generateCardIssueQrCode(cardDetails)
        } catch (e: CardIssueException) {
            throw InternalServerErrorResponse(e.message ?: "Failed to issue card with unknown error")
        }

        ctx.apply {
            contentType("image/png")
            result(qrCode)
        }
    }

    private fun parseCardDetails(params: Map<String, List<String>>) : CardDetails {
        val firstName = params["firstName"]?.get(0)
            ?: throw IllegalArgumentException("field 'firstName' was missing in the query parameters")
        val lastName = params["lastName"]?.get(0)
            ?: throw IllegalArgumentException("field 'lastName' was missing in the query parameters")
        val expirationDate = params["expirationDate"]?.get(0)
            ?: throw IllegalArgumentException("field 'expirationDate' was missing in the query parameters")

        val date = try {
            LocalDate.parse(expirationDate, DateTimeFormatter.ISO_DATE)
        } catch (e: Exception) {
            throw BadRequestResponse("Could not parse date with message: ${e.message}. Be sure to provide the date" +
                    "in ISO 8601, e.g.: 2020-12-21")
        }

        return CardDetails(firstName, lastName, date)
    }

    companion object {
        val getCardDocumentation: OpenApiDocumentation = document()
            .operation {
                it.description("Issue a new digital EAK")
            }
            .queryParam<String>("firstName") {
                it.required = true
            }
            .queryParam<String>("lastName") {
                it.required = true
            }
            .queryParam<String>("expirationDate") {
                it.required = true
                it.description = "In ISO 8601 format: YYYY-MM-DD"
            }
            .result<ByteArray>("200", "image/png")
    }
}