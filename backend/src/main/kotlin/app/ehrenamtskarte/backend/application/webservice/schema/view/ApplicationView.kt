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
    val withdrawalDate: String?,
    val note: String?,
    val cardCreated: Boolean?,
) {
    companion object {
        fun fromDbEntity(entity: ApplicationEntity, includePrivateInformation: Boolean = false): ApplicationView =
            ApplicationView(
                id = entity.id.value,
                regionId = entity.regionId.value,
                createdDate = entity.createdDate.toString(),
                jsonValue = entity.jsonValue,
                withdrawalDate = entity.withdrawalDate?.toString(),
                note = entity.note.takeIf { includePrivateInformation },
                cardCreated = (entity.status == ApplicationEntity.Status.ApprovedCardCreated)
                    .takeIf { includePrivateInformation },
            )
    }

    fun verifications(environment: DataFetchingEnvironment): CompletableFuture<List<ApplicationVerificationView>> =
        verificationsByApplicationLoader.fromEnvironment(environment).load(id).thenApply { it!! }
}
