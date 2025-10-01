package app.ehrenamtskarte.backend.graphql.auth.types

import app.ehrenamtskarte.backend.db.entities.AdministratorEntity
import app.ehrenamtskarte.backend.graphql.regions.types.Region
import graphql.schema.DataFetchingEnvironment
import org.springframework.graphql.data.method.annotation.SchemaMapping
import org.springframework.stereotype.Controller
import java.util.concurrent.CompletableFuture

data class Administrator(
    val id: Int,
    val email: String,
    val region: Region? = null, // dummy, resolved via @SchemaMapping
    val regionId: Int?,
    val role: Role,
) {
    companion object {
        fun fromDbEntity(entity: AdministratorEntity): Administrator =
            Administrator(
                id = entity.id.value,
                email = entity.email,
                regionId = entity.regionId?.value,
                role = Role.fromDbValue(entity.role),
            )
    }
}

@Controller
class AdministratorResolver {
    @SchemaMapping(typeName = "Administrator", field = "region")
    fun region(admin: Administrator, dfe: DataFetchingEnvironment): CompletableFuture<Region?> =
        admin.regionId?.let { id ->
            dfe.getDataLoader<Int, Region>(Region::class.java.name)?.load(id)
        } ?: CompletableFuture.completedFuture(null)
}
