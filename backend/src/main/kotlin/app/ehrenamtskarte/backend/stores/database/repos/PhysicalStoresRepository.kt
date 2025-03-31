package app.ehrenamtskarte.backend.stores.database.repos

import app.ehrenamtskarte.backend.common.database.sortByKeys
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.stores.database.AcceptingStores
import app.ehrenamtskarte.backend.stores.database.PhysicalStoreEntity
import app.ehrenamtskarte.backend.stores.database.PhysicalStores
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.select

object PhysicalStoresRepository {
    fun findAllInProject(project: String): List<PhysicalStoreEntity> {
        val query = (Projects innerJoin AcceptingStores innerJoin PhysicalStores)
            .slice(PhysicalStores.columns)
            .select { Projects.project eq project }
        return PhysicalStoreEntity.wrapRows(query).toList()
    }

    fun findByIdsInProject(project: String, ids: List<Int>): List<PhysicalStoreEntity?> {
        val query = (Projects innerJoin AcceptingStores innerJoin PhysicalStores)
            .slice(PhysicalStores.columns)
            .select { Projects.project eq project and (PhysicalStores.id inList ids) }
        return PhysicalStoreEntity.wrapRows(query).sortByKeys({ it.id.value }, ids)
    }

    fun findByIds(ids: List<Int>) =
        PhysicalStoreEntity.find { PhysicalStores.id inList ids }.sortByKeys({ it.id.value }, ids)
}
