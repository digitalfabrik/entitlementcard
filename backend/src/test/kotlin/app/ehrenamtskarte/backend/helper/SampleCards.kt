package app.ehrenamtskarte.backend.helper

import Card
import app.ehrenamtskarte.backend.graphql.cards.PEPPER_LENGTH
import app.ehrenamtskarte.backend.graphql.cards.hash
import java.security.SecureRandom
import java.util.Base64

/**
 * Provides Card.CardInfo test objects
 *
 * Usage in tests:
 * val cardInfo = SampleCards.bavarianStandard()
 */
object SampleCards {
    fun bavarianStandard(): Card.CardInfo =
        buildCardInfo(
            base = bavarianBase(),
            expirationDay = 365 * 40, // Equals 14.600
            bavariaCardType = Card.BavariaCardType.STANDARD,
        )

    fun bavarianGold(): Card.CardInfo =
        buildCardInfo(
            base = bavarianBase(),
            bavariaCardType = Card.BavariaCardType.GOLD,
            expirationDay = null,
        )

    fun nuernberg(): Card.CardInfo = nuernbergBase()

    fun nuernbergWithStartDay(): Card.CardInfo =
        buildCardInfo(
            base = nuernbergBase(),
            startDay = 365 * 2,
        )

    fun nuernbergWithPassId(): Card.CardInfo =
        buildCardInfo(
            base = nuernbergBase(),
            nuernbergPassIdIdentifier = Card.NuernergPassIdentifier.passId,
            startDay = 365 * 2,
        )

    fun nuernbergWithPassNr(): Card.CardInfo =
        buildCardInfo(
            base = nuernbergBase(),
            nuernbergPassIdIdentifier = Card.NuernergPassIdentifier.passNr,
            startDay = 365 * 2,
        )

    fun koblenzPass(): Card.CardInfo = koblenzBase()

    private fun bavarianBase(): Card.CardInfo =
        buildCardInfo(
            fullName = "Max Mustermann",
            regionId = 16,
        )

    private fun nuernbergBase(): Card.CardInfo =
        buildCardInfo(
            fullName = "Max Mustermann",
            regionId = 93,
            nuernbergPassId = 99999999,
            birthDay = -365 * 10,
            expirationDay = 365 * 40, // Equals 14.600
        )

    private fun koblenzBase(): Card.CardInfo =
        buildCardInfo(
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
    ): Card.CardInfo =
        Card.CardInfo.newBuilder(base).apply {
            fullName?.let { setFullName(it) }
            expirationDay?.let { setExpirationDay(it) }
            startDay?.let { extensionsBuilder.extensionStartDayBuilder.setStartDay(it) }
            birthDay?.let { extensionsBuilder.extensionBirthdayBuilder.setBirthday(it) }
            regionId?.let { extensionsBuilder.extensionRegionBuilder.setRegionId(it) }
            bavariaCardType?.let {
                extensionsBuilder.extensionBavariaCardTypeBuilder.setCardType(it)
            }
            nuernbergPassId?.let {
                extensionsBuilder.extensionNuernbergPassIdBuilder.setPassId(it)
            }
            nuernbergPassIdIdentifier?.let {
                extensionsBuilder.extensionNuernbergPassIdBuilder.setIdentifier(it)
            }
            koblenzReferenceNumber?.let {
                extensionsBuilder.extensionKoblenzReferenceNumberBuilder.setReferenceNumber(it)
            }
        }.buildPartial()

    fun Card.CardInfo.getEncoded(): String = Base64.getEncoder().encodeToString(this.toByteArray())

    fun Card.CardInfo.hash(): ByteArray =
        this.hash(ByteArray(PEPPER_LENGTH).also { SecureRandom.getInstanceStrong().nextBytes(it) })
}
