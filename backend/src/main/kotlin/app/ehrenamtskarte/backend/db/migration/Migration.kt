package app.ehrenamtskarte.backend.db.migration

import org.jetbrains.exposed.sql.Transaction

typealias Statement = (Transaction.() -> Unit?)

abstract class Migration {
    val name: String
    val version: Int

    init {
        val className = this::class.simpleName!!
        val groups =
            Regex("^V(\\d{4})_(.*)").matchEntire(className)?.groupValues ?: throw IllegalArgumentException(
                "Migration class name $className doesn't match convention.",
            )
        version = groups[1].toInt()
        name = groups[2]
    }

    abstract val migrate: Statement
}
