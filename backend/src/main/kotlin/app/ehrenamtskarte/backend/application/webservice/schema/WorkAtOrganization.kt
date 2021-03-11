package app.ehrenamtskarte.backend.application.webservice.schema

enum class AmountOfWorkUnit {
    HOURS_PER_WEEK,
    HOURS_PER_YEAR
}

data class WorkAtOrganization(
    val organization: Organization,
    val amountOfWork: Double,
    val amountOfWorkUnit: AmountOfWorkUnit,
    val certificate: Attachment
)
