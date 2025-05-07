package app.ehrenamtskarte.backend.migration.database

import org.jetbrains.exposed.dao.EntityClass
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IdTable
import org.jetbrains.exposed.sql.exists
import org.jetbrains.exposed.sql.javatime.timestamp
import org.jetbrains.exposed.sql.max

object Migrations : IdTable<Int>() {
    override val id = integer("version").entityId()
    val version = id

    override val primaryKey = PrimaryKey(version)

    val name = varchar("name", length = 400)
    val executedAt = timestamp("executed_at")

    fun getCurrentVersionOrNull(): Int? {
        val maxVersion = version.max()

        return if (Migrations.exists()) {
            Migrations.select(maxVersion).singleOrNull()?.get(maxVersion)?.value
        } else {
            null
        }
    }
}

class MigrationEntity(version: EntityID<Int>) : IntEntity(version) {
    companion object : EntityClass<Int, MigrationEntity>(Migrations)

    var version by Migrations.version
    var name by Migrations.name
    var executedAt by Migrations.executedAt
}
