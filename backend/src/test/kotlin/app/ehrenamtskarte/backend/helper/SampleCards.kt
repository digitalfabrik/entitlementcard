package app.ehrenamtskarte.backend.helper

import Card
import app.ehrenamtskarte.backend.cards.PEPPER_LENGTH
import app.ehrenamtskarte.backend.cards.hash
import java.security.SecureRandom
import java.util.Base64

/**
 * Provides Card.CardInfo test objects
 *
 * Usage in tests:
 * val cardInfo = SampleCards.BavarianStandard
 */
object SampleCards {
    val BavarianStandard: Card.CardInfo
        get() = buildCardInfo(
            base = bavarianBase,
            expirationDay = 365 * 40, // Equals 14.600
            bavariaCardType = Card.BavariaCardType.STANDARD,
        )

    val BavarianGold: Card.CardInfo
        get() = buildCardInfo(
            base = bavarianBase,
            bavariaCardType = Card.BavariaCardType.GOLD,
            expirationDay = null,
        )

    val Nuernberg: Card.CardInfo
        get() = nuernbergBase

    val NuernbergWithStartDay: Card.CardInfo
        get() = buildCardInfo(
            base = nuernbergBase,
            startDay = 365 * 2,
        )

    val NuernbergWithPassId: Card.CardInfo
        get() = buildCardInfo(
            base = nuernbergBase,
            nuernbergPassIdIdentifier = Card.NuernergPassIdentifier.passId,
            startDay = 365 * 2,
        )

    val NuernbergWithPassNr: Card.CardInfo
        get() = buildCardInfo(
            base = nuernbergBase,
            nuernbergPassIdIdentifier = Card.NuernergPassIdentifier.passNr,
            startDay = 365 * 2,
        )

    val KoblenzPass: Card.CardInfo
        get() = koblenzBase

    private val bavarianBase: Card.CardInfo
        get() = buildCardInfo(
            fullName = "Max Mustermann",
            regionId = 16,
        )

    private val nuernbergBase: Card.CardInfo
        get() {
            return buildCardInfo(
                fullName = "Max Mustermann",
                regionId = 93,
                nuernbergPassId = 99999999,
                birthDay = -365 * 10,
                expirationDay = 365 * 40, // Equals 14.600
            )
        }

    private val koblenzBase: Card.CardInfo
        get() = buildCardInfo(
            fullName = "Karla Koblenz",
            regionId = 95,
            koblenzReferenceNumber = "123K",
            birthDay = 12213, // 10.06.2003
        )

    private fun buildCardInfo(
        base: Card.CardInfo = Card.CardInfo.getDefaultInstance(),
        fullName: String? = null,
        expirationDay: Int? = null,
        regionId: Int? = null,
        bavariaCardType: Card.BavariaCardType? = null,
        birthDay: Int? = null,
        nuernbergPassId: Int? = null,
        nuernbergPassIdIdentifier: Card.NuernergPassIdentifier? = null,
        koblenzReferenceNumber: String? = null,
        startDay: Int? = null,
    ): Card.CardInfo {
        val cardInfo = Card.CardInfo.newBuilder(base)
        val extensions = cardInfo.extensionsBuilder
        if (fullName != null) cardInfo.setFullName(fullName)
        if (expirationDay != null) cardInfo.setExpirationDay(expirationDay)
        if (regionId != null) extensions.extensionRegionBuilder.setRegionId(regionId)
        if (bavariaCardType != null) {
            extensions.extensionBavariaCardTypeBuilder.setCardType(
                bavariaCardType,
            )
        }
        if (birthDay != null) extensions.extensionBirthdayBuilder.setBirthday(birthDay)
        if (nuernbergPassId != null) {
            extensions.extensionNuernbergPassIdBuilder.setPassId(
                nuernbergPassId,
            )
        }
        if (nuernbergPassIdIdentifier != null) {
            extensions.extensionNuernbergPassIdBuilder.setIdentifier(
                nuernbergPassIdIdentifier,
            )
        }
        if (koblenzReferenceNumber != null) {
            extensions.extensionKoblenzReferenceNumberBuilder.setReferenceNumber(
                koblenzReferenceNumber,
            )
        }
        if (startDay != null) extensions.extensionStartDayBuilder.setStartDay(startDay)
        return cardInfo.buildPartial()
    }

    fun Card.CardInfo.getEncoded(): String = Base64.getEncoder().encodeToString(this.toByteArray())

    fun Card.CardInfo.hash(): ByteArray {
        val pepper = ByteArray(PEPPER_LENGTH)
        SecureRandom.getInstanceStrong().nextBytes(pepper)
        return this.hash(pepper)
    }
}
