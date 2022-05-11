package app.ehrenamtskarte.backend.stores.database.repos

import app.ehrenamtskarte.backend.common.database.sortByKeys
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.regions.database.Regions
import app.ehrenamtskarte.backend.stores.database.PhysicalStoreEntity
import app.ehrenamtskarte.backend.stores.database.PhysicalStores
import org.jetbrains.exposed.sql.select

object PhysicalStoresRepository {

    fun findAll(project: String): List<PhysicalStoreEntity> {
        val query = (Projects innerJoin Regions innerJoin PhysicalStores)
            .slice(PhysicalStores.columns)
            .select { Projects.project eq project }
            .withDistinct()
        return PhysicalStoreEntity.wrapRows(query).toList()
    }

    fun findByIds(ids: List<Int>) =
        PhysicalStoreEntity.find { PhysicalStores.id inList ids }.sortByKeys({ it.id.value }, ids)

}
