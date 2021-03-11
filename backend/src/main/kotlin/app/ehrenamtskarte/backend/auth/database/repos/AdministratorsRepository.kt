package app.ehrenamtskarte.backend.auth.database.repos

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.database.Administrators
import app.ehrenamtskarte.backend.auth.database.PasswordCrypto
import app.ehrenamtskarte.backend.common.database.sortByKeys

object AdministratorsRepository {

    fun findByIds(ids: List<Int>) =
        AdministratorEntity.find { Administrators.id inList ids }.sortByKeys({ it.id.value }, ids)

    fun findByAuthData(email: String, password: String) =
        AdministratorEntity.find { Administrators.email eq email }
            .singleOrNull { PasswordCrypto.verifyPassword(password, it.passwordHash) }

    fun insert(email: String, password: String) =
        AdministratorEntity.new {
            this.email = email
            this.passwordHash = PasswordCrypto.hashPasswort(password)
        }
}
