package app.ehrenamtskarte.administration.card

class CardIssueException(override val message: String?, override val cause: Throwable? = null) : Exception() {
}