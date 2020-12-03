package xyz.elitese.ehrenamtskarte.database

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.Database.Companion.connect
import org.jetbrains.exposed.sql.transactions.transaction

class Database {

    companion object {
        fun setup() {
            Database().db

            transaction {
                // print sql to std-out
                addLogger(StdOutSqlLogger)

                SchemaUtils.create(
                        Categories,
                        Contacts,
                        AcceptingStores
                )
            }
        }
    }

    val db by lazy {
        val host = System.getProperty("app.postgres.host")
        val port = System.getProperty("app.postgres.port")
        val user = System.getProperty("app.postgres.user")
        val password = System.getProperty("app.postgres.password")
        val database = System.getProperty("app.postgres.database")
        
        connect("jdbc:pgsql://$host:$port/$database",
                driver = "com.impossibl.postgres.jdbc.PGDriver",
                user = user, password = password)
    }
}
