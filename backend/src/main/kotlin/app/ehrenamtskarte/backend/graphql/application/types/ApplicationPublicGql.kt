package app.ehrenamtskarte.backend.graphql.application.types

import app.ehrenamtskarte.backend.db.entities.ApplicationEntity
import app.ehrenamtskarte.backend.graphql.application.VerificationsByApplicationDataLoader
import com.expediagroup.graphql.generator.annotations.GraphQLName
import graphql.schema.DataFetchingEnvironment
import org.springframework.graphql.data.method.annotation.SchemaMapping
import org.springframework.stereotype.Controller
import java.util.concurrent.CompletableFuture

@GraphQLName("ApplicationPublic")
data class ApplicationPublicGql(
    val id: Int,
    val regionId: Int,
    val createdDate: String,
    val jsonValue: String,
    val status: ApplicationStatus,
    val statusResolvedDate: String?,
    val verifications: List<ApplicationVerificationView>? = null, // resolved by ApplicationVerificationsResolver
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

    @Controller
    class ApplicationVerificationsResolver {
        @SchemaMapping(typeName = "ApplicationPublic", field = "verifications")
        fun verifications(
            application: ApplicationPublicGql,
            dfe: DataFetchingEnvironment,
        ): CompletableFuture<List<ApplicationVerificationView>> {
            val loader = dfe.getDataLoader<Int, List<ApplicationVerificationView>>(VerificationsByApplicationDataLoader::class.java.name)
            return loader?.load(application.id) ?: CompletableFuture.completedFuture(emptyList())
        }
    }
}
