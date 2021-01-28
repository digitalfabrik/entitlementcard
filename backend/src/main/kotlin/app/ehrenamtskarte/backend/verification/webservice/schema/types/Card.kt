package app.ehrenamtskarte.backend.verification.webservice.schema.types

data class Card constructor(
    val totpSecret: ShortArray,
    val expirationDate: Long,
    val hashModel: String
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Card

        if (!totpSecret.contentEquals(other.totpSecret)) return false
        if (expirationDate != other.expirationDate) return false
        if (hashModel != other.hashModel) return false

        return true
    }

    override fun hashCode(): Int {
        var result = totpSecret.contentHashCode()
        result = 31 * result + expirationDate.hashCode()
        result = 31 * result + hashModel.hashCode()
        return result
    }
}

