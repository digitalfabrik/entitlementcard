package app.ehrenamtskarte.backend.projects.database

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable

object Projects : IntIdTable() {
    val project = varchar("project", 50).uniqueIndex()
    val host = varchar("host", 100)
}

class ProjectEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<ProjectEntity>(Projects)

    var project by Projects.project
    var host by Projects.host
}
