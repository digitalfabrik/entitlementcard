package app.ehrenamtskarte.backend.migration.database

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.exists
import org.jetbrains.exposed.sql.javatime.timestamp
import org.jetbrains.exposed.sql.max
import org.jetbrains.exposed.sql.selectAll

object Migrations : IntIdTable(columnName = "version") {
    val name = varchar("name", length = 400)
    val executedAt = timestamp("executed_at")

    fun getCurrentVersionOrNull() = if (Migrations.exists()) {
        Migrations.slice(id.max()).selectAll().singleOrNull()?.get(id.max())?.value
    } else {
        null
    }
}

class MigrationEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<MigrationEntity>(Migrations)

    var version by Migrations.id
    var name by Migrations.name
    var executedAt by Migrations.executedAt
}
