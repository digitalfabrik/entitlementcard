package app.ehrenamtskarte.backend.application.webservice.schema.view

import app.ehrenamtskarte.backend.application.database.ApplicationEntity
import app.ehrenamtskarte.backend.application.webservice.dataloader.verificationsByApplicationLoader
import app.ehrenamtskarte.backend.common.webservice.fromEnvironment
import graphql.schema.DataFetchingEnvironment
import java.util.concurrent.CompletableFuture

@Suppress("unused")
data class ApplicationView(
    val id: Int,
    val regionId: Int,
    val createdDate: String,
    val jsonValue: String,
    val note: String?,
    val status: ApplicationStatus?,
    val statusResolvedDate: String?,
    val rejectionMessage: String?,
) {
    companion object {
        fun fromDbEntity(entity: ApplicationEntity, includePrivateInformation: Boolean = false): ApplicationView =
            ApplicationView(
                id = entity.id.value,
                regionId = entity.regionId.value,
                createdDate = entity.createdDate.toString(),
                jsonValue = entity.jsonValue,
                note = entity.note.takeIf { includePrivateInformation },
                status = entity.status.takeIf { includePrivateInformation }?.toGraphQlType(),
                statusResolvedDate = entity.statusResolvedDate?.takeIf { includePrivateInformation }?.toString(),
                rejectionMessage = entity.rejectionMessage.takeIf { includePrivateInformation },
            )
    }

    enum class ApplicationStatus {
        Pending,
        Rejected,
        Approved,
        ApprovedCardCreated,
        Withdrawn,
    }

    fun verifications(environment: DataFetchingEnvironment): CompletableFuture<List<ApplicationVerificationView>> =
        verificationsByApplicationLoader.fromEnvironment(environment).load(id).thenApply { it!! }
}

fun ApplicationEntity.Status.toGraphQlType() =
    when (this) {
        ApplicationEntity.Status.Pending -> ApplicationView.ApplicationStatus.Pending
        ApplicationEntity.Status.Rejected -> ApplicationView.ApplicationStatus.Rejected
        ApplicationEntity.Status.Approved -> ApplicationView.ApplicationStatus.Approved
        ApplicationEntity.Status.ApprovedCardCreated -> ApplicationView.ApplicationStatus.ApprovedCardCreated
        ApplicationEntity.Status.Withdrawn -> ApplicationView.ApplicationStatus.Withdrawn
    }
