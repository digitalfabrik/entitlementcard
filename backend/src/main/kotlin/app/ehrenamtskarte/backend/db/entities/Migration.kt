package app.ehrenamtskarte.backend.db.entities

import org.jetbrains.exposed.v1.core.dao.id.EntityID
import org.jetbrains.exposed.v1.core.dao.id.IdTable
import org.jetbrains.exposed.v1.core.max
import org.jetbrains.exposed.v1.dao.EntityClass
import org.jetbrains.exposed.v1.dao.IntEntity
import org.jetbrains.exposed.v1.javatime.timestamp
import org.jetbrains.exposed.v1.jdbc.exists
import org.jetbrains.exposed.v1.jdbc.select

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
