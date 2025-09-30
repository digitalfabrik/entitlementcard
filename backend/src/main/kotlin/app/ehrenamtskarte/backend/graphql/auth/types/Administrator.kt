package app.ehrenamtskarte.backend.graphql.auth.types

import app.ehrenamtskarte.backend.db.entities.AdministratorEntity
import app.ehrenamtskarte.backend.graphql.regions.types.Region
import graphql.schema.DataFetchingEnvironment
import java.util.concurrent.CompletableFuture

class Administrator(
    val id: Int,
    val email: String,
    val regionId: Int?,
    val role: Role,
) {
    companion object {
        fun fromDbEntity(entity: AdministratorEntity): Administrator =
            Administrator(
                entity.id.value,
                entity.email,
                entity.regionId?.value,
                Role.fromDbValue(entity.role),
            )
    }

    fun region(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<Region?> =
        if (regionId == null) {
            CompletableFuture.completedFuture(null)
        } else {
            dataFetchingEnvironment.getDataLoader<Int, Region>("REGION_LOADER")
                ?.load(regionId)
                ?: CompletableFuture.completedFuture(null)
        }
}
