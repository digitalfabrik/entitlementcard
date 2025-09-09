package app.ehrenamtskarte.backend.cards

import app.ehrenamtskarte.backend.graphql.cards.hash
import app.ehrenamtskarte.backend.helper.SampleCards
import io.ktor.util.decodeBase64Bytes
import io.ktor.util.encodeBase64
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals

internal class CardInfoExtensionsTest {
    private val pepper = "MvMjEqa0ulFDAgACElMjWA==".decodeBase64Bytes()

    @Test
    fun shouldCreateStableHashForBavarianBlueEAK() {
        val cardInfo = SampleCards.bavarianStandard()
        val hash = cardInfo.hash(pepper).encodeBase64()

        assertEquals("rS8nukf7S9j8V1j+PZEkBQWlAeM2WUKkmxBHi1k9hRo=", hash)
    }

    @Test
    fun shouldCreateStableHashForBavarianGoldenEAK() {
        val cardInfo = SampleCards.bavarianGold()
        val hash = cardInfo.hash(pepper).encodeBase64()

        assertEquals("ZZTYNcFwEoAT7Z2ylesSn3oF7OInshUqWbZpP3zZcDw=", hash)
    }

    @Test
    fun shouldCreateStableHashForNuernbergPass() {
        val cardInfo = SampleCards.nuernberg()
        val hash = cardInfo.hash(pepper).encodeBase64()

        assertEquals("zogEJOhnSSp//8qhym/DdorQYgL/763Kfq4slWduxMg=", hash)
    }

    @Test
    fun shouldCreateStableHashForNuernbergPassWithStartDay() {
        val cardInfo = SampleCards.nuernbergWithStartDay()
        val hash = cardInfo.hash(pepper).encodeBase64()

        assertEquals("1ChHiAvWygwu+bH2yOZOk1zdmwTDZ4mkvu079cyuLjE=", hash)
    }

    @Test
    fun shouldCreateStableHashForNuernbergPassWithPassIdIdentifier() {
        val cardInfo = SampleCards.nuernbergWithPassId()
        val hash = cardInfo.hash(pepper).encodeBase64()

        assertEquals("6BS3mnTtX1myCu9HSUD3e7KjaFBnX9Bkw7wgkrrWMZg=", hash)
    }

    @Test
    fun shouldCreateStableHashForNuernbergPassWithPassNrIdentifier() {
        val cardInfo = SampleCards.nuernbergWithPassNr()
        val hash = cardInfo.hash(pepper).encodeBase64()

        assertEquals("A7KP1ypGngrmegXVmsyP9iMgheGHUDg9rnqbb9nlMWw=", hash)
    }
}
