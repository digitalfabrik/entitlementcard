package app.ehrenamtskarte.backend.migration.database

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IdTable
import org.jetbrains.exposed.sql.javatime.CurrentTimestamp
import org.jetbrains.exposed.sql.javatime.timestamp

object Migrations : IdTable<Int>() {
    override val id = integer("version").entityId()
    override val primaryKey = PrimaryKey(id)

    val name = varchar("name", length = 400).index()
    val executedAt = timestamp("executed_at").defaultExpression(CurrentTimestamp())
}

class MigrationEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<MigrationEntity>(Migrations)

    var version by Migrations.id
    var name by Migrations.name
    var executedAt by Migrations.executedAt
}
