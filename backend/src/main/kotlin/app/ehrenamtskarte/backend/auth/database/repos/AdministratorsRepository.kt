package app.ehrenamtskarte.backend.auth.database.repos

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.database.Administrators
import app.ehrenamtskarte.backend.auth.database.PasswordCrypto
import app.ehrenamtskarte.backend.common.database.sortByKeys

object AdministratorsRepository {

    fun findByIds(ids: List<Int>) =
        AdministratorEntity.find { Administrators.id inList ids }.sortByKeys({ it.id.value }, ids)

    fun findByAuthData(username: String, password: String) =
        AdministratorEntity.find { Administrators.username eq username }
            .singleOrNull { PasswordCrypto.verifyPassword(password, it.passwordHash) }

    fun insert(username: String, password: String) =
        AdministratorEntity.new {
            this.username = username
            this.passwordHash = PasswordCrypto.hashPasswort(password)
        }
}
