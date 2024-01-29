package app.ehrenamtskarte.backend.helper

enum class CardType {
    BavarianStandard,
    BavarianGold,
    Nuernberg,
    NuernbergWithStartDay,
    NuernbergWithPassId,
    NuernbergWithPassNr
}

object ExampleCardInfo {
    private val bavarianBase = buildCardInfo(
        Card.CardInfo.getDefaultInstance(),
        fullName = "Max Mustermann",
        regionId = 16
    )

    private val nuernbergBase = buildCardInfo(
        Card.CardInfo.getDefaultInstance(),
        fullName = "Max Mustermann",
        regionId = 93,
        nuernbergPassId = 99999999,
        birthDay = -365 * 10,
        expirationDay = 365 * 40 // Equals 14.600
    )

    private fun buildCardInfo(
        base: Card.CardInfo,
        fullName: String? = null,
        expirationDay: Int? = null,
        regionId: Int? = null,
        bavariaCardType: Card.BavariaCardType? = null,
        birthDay: Int? = null,
        nuernbergPassId: Int? = null,
        nuernbergPassIdIdentifier: Card.NuernergPassIdentifier? = null,
        startDay: Int? = null
    ): Card.CardInfo {
        val cardInfo = Card.CardInfo.newBuilder(base)
        val extensions = cardInfo.extensionsBuilder
        if (fullName != null) cardInfo.setFullName(fullName)
        if (expirationDay != null) cardInfo.setExpirationDay(expirationDay)
        if (regionId != null) extensions.extensionRegionBuilder.setRegionId(regionId)
        if (bavariaCardType != null) extensions.extensionBavariaCardTypeBuilder.setCardType(bavariaCardType)
        if (birthDay != null) extensions.extensionBirthdayBuilder.setBirthday(birthDay)
        if (nuernbergPassId != null) extensions.extensionNuernbergPassIdBuilder.setPassId(nuernbergPassId)
        if (nuernbergPassIdIdentifier != null) {
            extensions.extensionNuernbergPassIdBuilder.setIdentifier(
                nuernbergPassIdIdentifier
            )
        }
        if (startDay != null) extensions.extensionStartDayBuilder.setStartDay(startDay)
        return cardInfo.buildPartial()
    }

    fun get(cardType: CardType): Card.CardInfo {
        return when (cardType) {
            CardType.BavarianStandard -> buildCardInfo(
                bavarianBase,
                expirationDay = 365 * 40, // Equals 14.600
                bavariaCardType = Card.BavariaCardType.STANDARD
            )

            CardType.BavarianGold -> buildCardInfo(
                bavarianBase,
                bavariaCardType = Card.BavariaCardType.GOLD
            )

            CardType.Nuernberg -> nuernbergBase
            CardType.NuernbergWithStartDay -> buildCardInfo(
                nuernbergBase,
                startDay = 365 * 2
            )

            CardType.NuernbergWithPassId -> buildCardInfo(
                nuernbergBase,
                nuernbergPassIdIdentifier = Card.NuernergPassIdentifier.passId,
                startDay = 365 * 2
            )

            CardType.NuernbergWithPassNr -> buildCardInfo(
                nuernbergBase,
                nuernbergPassIdIdentifier = Card.NuernergPassIdentifier.passNr,
                startDay = 365 * 2
            )
        }
    }
}
