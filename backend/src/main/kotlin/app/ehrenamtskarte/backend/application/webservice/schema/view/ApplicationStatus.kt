package app.ehrenamtskarte.backend.application.webservice.schema.view

import app.ehrenamtskarte.backend.application.database.ApplicationEntity

enum class ApplicationStatus {
    Pending,
    Rejected,
    Approved,
    ApprovedCardCreated,
    Withdrawn,
}

fun ApplicationEntity.Status.toGraphQlType() =
    when (this) {
        ApplicationEntity.Status.Pending -> ApplicationStatus.Pending
        ApplicationEntity.Status.Rejected -> ApplicationStatus.Rejected
        ApplicationEntity.Status.Approved -> ApplicationStatus.Approved
        ApplicationEntity.Status.ApprovedCardCreated -> ApplicationStatus.ApprovedCardCreated
        ApplicationEntity.Status.Withdrawn -> ApplicationStatus.Withdrawn
    }
