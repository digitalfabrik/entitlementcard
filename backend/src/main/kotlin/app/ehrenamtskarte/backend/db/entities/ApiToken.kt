package app.ehrenamtskarte.backend.db.entities

import org.jetbrains.exposed.v1.core.dao.id.EntityID
import org.jetbrains.exposed.v1.core.dao.id.IntIdTable
import org.jetbrains.exposed.v1.dao.IntEntity
import org.jetbrains.exposed.v1.dao.IntEntityClass
import org.jetbrains.exposed.v1.javatime.date

const val TOKEN_LENGTH = 60

enum class ApiTokenType {
    USER_IMPORT,
    VERIFIED_APPLICATION,
}

object ApiTokens : IntIdTable() {
    val tokenHash = binary("tokenHash").uniqueIndex()
    val creatorId = reference("creatorId", Administrators)
    val projectId = reference("projectId", Projects)
    val expirationDate = date("expirationDate")
    val type = enumerationByName("type", 50, ApiTokenType::class)
}

class ApiTokenEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<ApiTokenEntity>(ApiTokens)

    var tokenHash by ApiTokens.tokenHash
    var creator by ApiTokens.creatorId
    var projectId by ApiTokens.projectId
    var expirationDate by ApiTokens.expirationDate
    var type by ApiTokens.type
}
