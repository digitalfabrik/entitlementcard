package app.ehrenamtskarte.backend.application.webservice.schema.view

import app.ehrenamtskarte.backend.application.database.ApplicationEntity
import app.ehrenamtskarte.backend.application.webservice.dataloader.VERIFICATIONS_BY_APPLICATION_LOADER_NAME
import graphql.schema.DataFetchingEnvironment
import java.util.concurrent.CompletableFuture

@Suppress("unused")
data class ApplicationView(val id: Int, val regionId: Int, val createdDate: String, val jsonValue: String) {
    companion object {
        fun fromDbEntity(entity: ApplicationEntity): ApplicationView =
            ApplicationView(entity.id.value, entity.regionId.value, entity.createdDate.toString(), entity.jsonValue)
    }

    fun verifications(dfe: DataFetchingEnvironment): CompletableFuture<List<ApplicationVerificationView>> {
        return dfe.getDataLoader<Int, List<ApplicationVerificationView>?>(
            VERIFICATIONS_BY_APPLICATION_LOADER_NAME,
        ).load(this.id)!!
    }
}
