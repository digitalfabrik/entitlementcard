package app.ehrenamtskarte.backend.common.utils

import org.jetbrains.exposed.sql.statements.StatementType
import org.jetbrains.exposed.sql.transactions.TransactionManager
import java.sql.ResultSet

fun <T : Any> String.executeAndMapSelectStatement(transform: (ResultSet) -> T): List<T> {
    val result = arrayListOf<T>()
    TransactionManager.current().exec(this, explicitStatementType = StatementType.SELECT) { rs ->
        while (rs.next()) {
            result += transform(rs)
        }
    }
    return result
}
