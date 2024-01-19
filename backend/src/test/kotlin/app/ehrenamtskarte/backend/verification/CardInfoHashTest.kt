package app.ehrenamtskarte.backend.verification

import Card
import io.ktor.util.encodeBase64
import kotlin.test.Test
import kotlin.test.assertEquals

internal class CardInfoHashTest {
    @Test
    fun mapEmptyCardInfo() {
        val cardInfo = Card.CardInfo.newBuilder().build()
        assertEquals(CardInfoHash.toMap(cardInfo), emptyMap())
    }

    @Test
    fun mapCardInfoWithFullName() {
        val wildName = "Biene Maja ßäЦЧШܐܳܠܰܦ"
        val cardInfo = Card.CardInfo.newBuilder().setFullName(wildName).build()
        assertEquals(CardInfoHash.toMap(cardInfo), mapOf("1" to wildName))
    }

    @Test
    fun mapCardInfoForBavarianBlueEAK() {
        val cardInfo = Card.CardInfo.newBuilder()
            .setFullName("Max Mustermann")
            .setExpirationDay(365 * 40) // Equals 14.600
            .setExtensions(
                Card.CardExtensions.newBuilder()
                    .setExtensionRegion(Card.RegionExtension.newBuilder().setRegionId(16).build())
                    .setExtensionBavariaCardType(
                        Card.BavariaCardTypeExtension.newBuilder().setCardType(Card.BavariaCardType.STANDARD).build()
                    )
                    .build()
            )
            .build()
        println(cardInfo.toByteArray().encodeBase64())

        assertEquals(
            CardInfoHash.toMap(cardInfo),
            mapOf(
                "1" to "Max Mustermann",
                "2" to "14600",
                "3" to mapOf(
                    "1" to mapOf("1" to "16"), // extensionRegion
                    "4" to mapOf("1" to "0") // extensionBavariaCardType
                )
            )
        )
    }

    @Test
    fun mapCardInfoForBavarianGoldenEAK() {
        val cardInfo = Card.CardInfo.newBuilder()
            .setFullName("Max Mustermann")
            .setExtensions(
                Card.CardExtensions.newBuilder()
                    .setExtensionRegion(Card.RegionExtension.newBuilder().setRegionId(16).build())
                    .setExtensionBavariaCardType(
                        Card.BavariaCardTypeExtension.newBuilder().setCardType(Card.BavariaCardType.GOLD).build()
                    )
                    .build()
            )
            .build()
        assertEquals(
            CardInfoHash.toMap(cardInfo),
            mapOf(
                "1" to "Max Mustermann",
                "3" to mapOf(
                    "1" to mapOf("1" to "16"), // extensionRegion
                    "4" to mapOf("1" to "1") // extensionBavariaCardType
                )
            )
        )
    }

    @Test
    fun mapCardInfoForNuernbergPass() {
        val cardInfo = Card.CardInfo.newBuilder()
            .setFullName("Max Mustermann")
            .setExpirationDay(365 * 40) // Equals 14.600
            .setExtensions(
                Card.CardExtensions.newBuilder()
                    .setExtensionBirthday(Card.BirthdayExtension.newBuilder().setBirthday(-365 * 10).build())
                    .setExtensionNuernbergPassId(Card.NuernbergPassIdExtension.newBuilder().setPassId(9999999))
                    .setExtensionRegion(Card.RegionExtension.newBuilder().setRegionId(93).build())
                    .build()
            )
            .build()
        assertEquals(
            CardInfoHash.toMap(cardInfo),
            mapOf(
                "1" to "Max Mustermann",
                "2" to "14600",
                "3" to mapOf(
                    "1" to mapOf("1" to "93"), // extensionRegion
                    "2" to mapOf("1" to "-3650"), // extensionBirthday
                    "3" to mapOf("1" to "9999999") // extensionNuernbergPassId
                )
            )
        )
    }

    @Test
    fun mapCardInfoForNuernbergPassWithStartDay() {
        val cardInfo = Card.CardInfo.newBuilder()
            .setFullName("Max Mustermann")
            .setExpirationDay(365 * 40) // Equals 14.600
            .setExtensions(
                Card.CardExtensions.newBuilder()
                    .setExtensionBirthday(Card.BirthdayExtension.newBuilder().setBirthday(-365 * 10).build())
                    .setExtensionNuernbergPassId(Card.NuernbergPassIdExtension.newBuilder().setPassId(9999999))
                    .setExtensionRegion(Card.RegionExtension.newBuilder().setRegionId(93).build())
                    .setExtensionStartDay(Card.StartDayExtension.newBuilder().setStartDay(365 * 2).build())
                    .build()
            )
            .build()
        assertEquals(
            CardInfoHash.toMap(cardInfo),
            mapOf(
                "1" to "Max Mustermann",
                "2" to "14600",
                "3" to mapOf(
                    "1" to mapOf("1" to "93"), // extensionRegion
                    "2" to mapOf("1" to "-3650"), // extensionBirthday
                    "3" to mapOf("1" to "9999999"), // extensionNuernbergPassId
                    "5" to mapOf("1" to "730") // extensionStartDay
                )
            )
        )
    }
}
