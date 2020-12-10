package xyz.elitese.ehrenamtskarte.database

import org.jetbrains.exposed.sql.Database.Companion.connect
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.StdOutSqlLogger
import org.jetbrains.exposed.sql.addLogger
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import java.nio.file.Files
import java.nio.file.Paths
import com.impossibl.postgres.jdbc.PGDataSource
import java.util.stream.Collectors

import java.io.BufferedReader
import java.io.InputStreamReader


class Database {

    companion object {
        private fun executeScript(path: String) {
            val java = Database::class.java
            val resource = java.classLoader.getResource(path) ?: throw Exception("Failed to find script")
            val stream = resource.openStream()
            val sql = BufferedReader(InputStreamReader(stream))
                .lines().collect(Collectors.joining("\n"))
            stream.close()
            with(TransactionManager.current()) {
                exec(sql)
            }
        }

        fun setup() {
            Database().db

            transaction {
                // print sql to std-out
                addLogger(StdOutSqlLogger)

                SchemaUtils.create(
                        Categories,
                        Contacts,
                        AcceptingStores,
                        PhysicalStores,
                        Addresses
                )

                executeScript("sql/create_tilebbox.sql")
                executeScript("sql/create_accepting_stores_clustered.sql")
            }
        }
    }

    val db by lazy {
        val ds = PGDataSource()
        ds.serverName = System.getProperty("app.postgres.host")
        ds.databaseName = System.getProperty("app.postgres.database")
        ds.user = System.getProperty("app.postgres.user")
        ds.password = System.getProperty("app.postgres.password")

        connect(ds)
    }
}
