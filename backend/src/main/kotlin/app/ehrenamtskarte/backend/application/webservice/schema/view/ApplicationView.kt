package app.ehrenamtskarte.backend.application.webservice.schema.view

import app.ehrenamtskarte.backend.application.database.ApplicationEntity
import app.ehrenamtskarte.backend.application.webservice.dataloader.verificationsByApplicationLoader
import app.ehrenamtskarte.backend.common.webservice.fromEnvironment
import graphql.schema.DataFetchingEnvironment
import java.util.concurrent.CompletableFuture

@Suppress("unused")
data class ApplicationView(val id: Int, val regionId: Int, val createdDate: String, val jsonValue: String, val withdrawalDate: String) {
    companion object {
        fun fromDbEntity(entity: ApplicationEntity): ApplicationView =
            ApplicationView(entity.id.value, entity.regionId.value, entity.createdDate.toString(), entity.jsonValue, entity.withdrawalDate.toString())
    }

    fun verifications(environment: DataFetchingEnvironment): CompletableFuture<List<ApplicationVerificationView>> =
        verificationsByApplicationLoader.fromEnvironment(environment).load(id).thenApply { it!! }
}
