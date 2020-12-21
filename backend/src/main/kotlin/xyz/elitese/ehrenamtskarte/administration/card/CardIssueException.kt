package xyz.elitese.ehrenamtskarte.administration.card

class CardIssueException(override val message: String?, override val cause: Throwable? = null) : Exception() {
}