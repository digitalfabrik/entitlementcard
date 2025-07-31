package app.ehrenamtskarte.backend.application.webservice.schema.view

import app.ehrenamtskarte.backend.application.database.ApplicationEntity
import app.ehrenamtskarte.backend.application.webservice.dataloader.verificationsByApplicationLoader
import app.ehrenamtskarte.backend.common.webservice.fromEnvironment
import com.expediagroup.graphql.generator.annotations.GraphQLName
import graphql.schema.DataFetchingEnvironment
import java.util.concurrent.CompletableFuture

@GraphQLName("ApplicationPublic")
data class ApplicationPublicGql(
    val id: Int,
    val regionId: Int,
    val createdDate: String,
    val jsonValue: String,
    val status: ApplicationStatus,
    val statusResolvedDate: String?,
) {
    companion object {
        fun fromDbEntity(entity: ApplicationEntity): ApplicationPublicGql =
            ApplicationPublicGql(
                id = entity.id.value,
                regionId = entity.regionId.value,
                createdDate = entity.createdDate.toString(),
                jsonValue = entity.jsonValue,
                status = entity.status.toGraphQlType(),
                statusResolvedDate = entity.statusResolvedDate?.toString(),
            )
    }

    @Suppress("unused")
    fun verifications(dfe: DataFetchingEnvironment): CompletableFuture<List<ApplicationVerificationView>> =
        verificationsByApplicationLoader.fromEnvironment(dfe).load(id).thenApply { it }
}
