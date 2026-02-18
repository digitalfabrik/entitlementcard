package app.ehrenamtskarte.backend.cards

import app.ehrenamtskarte.backend.graphql.cards.utils.hash
import app.ehrenamtskarte.backend.helper.SampleCards
import org.junit.jupiter.api.Test
import kotlin.io.encoding.Base64
import kotlin.test.assertEquals

internal class CardInfoExtensionsTest {
    private val pepper = Base64.decode("MvMjEqa0ulFDAgACElMjWA==")

    @Test
    fun shouldCreateStableHashForBavarianBlueEAK() {
        val cardInfo = SampleCards.bavarianStandard()
        val hash = Base64.encode(cardInfo.hash(pepper))

        assertEquals("rS8nukf7S9j8V1j+PZEkBQWlAeM2WUKkmxBHi1k9hRo=", hash)
    }

    @Test
    fun shouldCreateStableHashForBavarianGoldenEAK() {
        val cardInfo = SampleCards.bavarianGold()
        val hash = Base64.encode(cardInfo.hash(pepper))

        assertEquals("ZZTYNcFwEoAT7Z2ylesSn3oF7OInshUqWbZpP3zZcDw=", hash)
    }

    @Test
    fun shouldCreateStableHashForNuernbergPass() {
        val cardInfo = SampleCards.nuernberg()
        val hash = Base64.encode(cardInfo.hash(pepper))

        assertEquals("zogEJOhnSSp//8qhym/DdorQYgL/763Kfq4slWduxMg=", hash)
    }

    @Test
    fun shouldCreateStableHashForNuernbergPassWithStartDay() {
        val cardInfo = SampleCards.nuernbergWithStartDay()
        val hash = Base64.encode(cardInfo.hash(pepper))

        assertEquals("1ChHiAvWygwu+bH2yOZOk1zdmwTDZ4mkvu079cyuLjE=", hash)
    }

    @Test
    fun shouldCreateStableHashForNuernbergPassWithPassIdIdentifier() {
        val cardInfo = SampleCards.nuernbergWithPassId()
        val hash = Base64.encode(cardInfo.hash(pepper))

        assertEquals("6BS3mnTtX1myCu9HSUD3e7KjaFBnX9Bkw7wgkrrWMZg=", hash)
    }

    @Test
    fun shouldCreateStableHashForNuernbergPassWithPassNrIdentifier() {
        val cardInfo = SampleCards.nuernbergWithPassNr()
        val hash = Base64.encode(cardInfo.hash(pepper))

        assertEquals("A7KP1ypGngrmegXVmsyP9iMgheGHUDg9rnqbb9nlMWw=", hash)
    }
}
