package xyz.elitese.ehrenamtskarte.administration.card

import io.jsonwebtoken.Jwts
import java.security.Key

class CardTokenGenerator(private val privateSignKey: Key) {

    fun createCardToken(payload: String): String {
        try {
            return Jwts.builder()
                .setPayload(payload)
                .signWith(privateSignKey)
                .compact()
        } catch (e: Exception) {
            throw CardIssueException("An exception occurred while trying to build a jwt", e)
        }
    }
}