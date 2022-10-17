package app.ehrenamtskarte.backend.projects.database

import app.ehrenamtskarte.backend.stores.database.AcceptingStores
import app.ehrenamtskarte.backend.stores.database.Addresses
import app.ehrenamtskarte.backend.stores.database.Contacts
import app.ehrenamtskarte.backend.stores.database.PhysicalStores
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.inList
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.select

object Projects : IntIdTable() {
    val project = varchar("project", 50).uniqueIndex()
}

class ProjectEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<ProjectEntity>(Projects)

    var project by Projects.project

    fun deleteAssociatedStores() {
        val project = this

        val acceptingStoresDelete =
            AcceptingStores.slice(AcceptingStores.id).select { AcceptingStores.projectId eq project.id }
                .map { it[AcceptingStores.id] }

        val contactsDelete =
            (AcceptingStores innerJoin Contacts).slice(Contacts.id)
                .select { AcceptingStores.projectId eq project.id }
                .map { it[Contacts.id] }

        val physicalStoresDelete =
            (PhysicalStores innerJoin AcceptingStores).slice(PhysicalStores.id)
                .select { AcceptingStores.projectId eq project.id }
                .map { it[PhysicalStores.id] }

        val addressesDelete =
            ((PhysicalStores innerJoin Addresses) innerJoin AcceptingStores).slice(Addresses.id)
                .select { AcceptingStores.projectId eq project.id }
                .map { it[Addresses.id] }

        PhysicalStores.deleteWhere {
            id inList physicalStoresDelete
        }

        Addresses.deleteWhere {
            id inList addressesDelete
        }

        AcceptingStores.deleteWhere {
            id inList acceptingStoresDelete
        }

        Contacts.deleteWhere {
            id inList contactsDelete
        }
    }
}
