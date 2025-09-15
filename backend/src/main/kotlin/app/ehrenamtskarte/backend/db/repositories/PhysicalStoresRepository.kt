package app.ehrenamtskarte.backend.db.repositories

import app.ehrenamtskarte.backend.db.entities.AcceptingStores
import app.ehrenamtskarte.backend.db.entities.PhysicalStoreEntity
import app.ehrenamtskarte.backend.db.entities.PhysicalStores
import app.ehrenamtskarte.backend.db.entities.Projects
import app.ehrenamtskarte.backend.shared.database.sortByKeys
import org.jetbrains.exposed.sql.and

object PhysicalStoresRepository {
    fun findAllInProject(project: String): List<PhysicalStoreEntity> {
        val query = (Projects innerJoin AcceptingStores innerJoin PhysicalStores)
            .select(PhysicalStores.columns)
            .where { Projects.project eq project }
        return PhysicalStoreEntity.wrapRows(query).toList()
    }

    fun findByIdsInProject(project: String, ids: List<Int>): List<PhysicalStoreEntity?> {
        val query = (Projects innerJoin AcceptingStores innerJoin PhysicalStores)
            .select(PhysicalStores.columns)
            .where { Projects.project eq project and (PhysicalStores.id inList ids) }
        return PhysicalStoreEntity.wrapRows(query).sortByKeys({ it.id.value }, ids)
    }

    fun findByIds(ids: List<Int>) =
        PhysicalStoreEntity.find { PhysicalStores.id inList ids }.sortByKeys({ it.id.value }, ids)
}
