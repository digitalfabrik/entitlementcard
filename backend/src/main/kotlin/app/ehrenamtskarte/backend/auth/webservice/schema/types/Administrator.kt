package app.ehrenamtskarte.backend.auth.webservice.schema.types

import app.ehrenamtskarte.backend.db.entities.AdministratorEntity
import app.ehrenamtskarte.backend.common.webservice.fromEnvironment
import app.ehrenamtskarte.backend.regions.webservice.dataloader.regionLoader
import app.ehrenamtskarte.backend.regions.webservice.schema.types.Region
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
            regionLoader.fromEnvironment(dataFetchingEnvironment).load(regionId)
        }
}
