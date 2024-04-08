package app.ehrenamtskarte.backend.stores.importer.nuernberg.utils

const val emptyLine = "\n\n"
data class Discounts(val discountDE: String?, val discountEN: String?)
fun splitDiscount(discount: String?): Discounts {
    if (discount === null) {
        return Discounts(discountDE = "", discountEN = "")
    } else if (discount.contains(emptyLine)) {
        val discountList = discount.split(emptyLine)
        return Discounts(discountDE = discountList[0], discountEN = discountList[1])
    }
    return Discounts(discountDE = discount, discountEN = "")
}

fun mergeDiscount(discounts: Discounts): String {
    if (discounts.discountEN === null && discounts.discountDE !== null) {
        return discounts.discountDE
    }
    if (discounts.discountDE === null && discounts.discountEN !== null) {
        return discounts.discountEN
    }
    return discounts.discountDE + emptyLine + discounts.discountEN
}
